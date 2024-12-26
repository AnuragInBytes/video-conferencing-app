import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const Room = ({ roomId }) => {
  const [peers] = useState(new Map());
  const [streams, setStreams] = useState(new Map());
  const socketRef = useRef();
  const localStreamRef = useRef();
  const localVideoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasLocalVideo, setHadLocalVideo] = useState(false);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.vidyo.com:3478'},
      { urls: 'stun:stun.phone.com:3478'},
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  const attachStreamToVideo = (videoElement, stream) => {
    if(videoElement && stream) {
      videoElement.srcObject = stream;
      videoElement.onloadmetadata = () => {
        videoElement.play().catch(e => console.error('Video play failed: ', e));
      };
    };
  };

  useEffect(() => {

    let mounted = true;

    const initializeStream = async () => {
      try {
        console.log("Requesting media access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if(!mounted) return;

        console.log("Media access granted, Video track: ", stream.getVideoTracks().length);
        console.log("Audio Track: ", stream.getAudioTracks().length);

        localStreamRef.current = stream;

        const videoTrack = stream.getVideoTracks()[0];
        if(videoTrack) {
          console.log("Video track settings: ", videoTrack.getSettings());
          setHadLocalVideo(true);
        }

        if(localVideoRef.current){
          attachStreamToVideo(localVideoRef.current, stream);
        }

        setIsConnected(true);
        socketRef.current.emit("join-room", roomId);
      } catch (error) {
        console.error("Error accessing media devices: ", error);
      }
    };

    socketRef.current = io('http://localhost:5000');

    initializeStream();

    socketRef.current.on('user-joined', handleUserJoined);
    socketRef.current.on('existing-participants', handlerExistingParticipants);
    socketRef.current.on('offer', handleOffer);
    socketRef.current.on('answer', handleAnswer);
    socketRef.current.on('ice-candidate', handleIceCandidate);
    socketRef.current.on('user-left', handleUserLeft);

    return () => {
      mounted = false;
      cleanup();
    };
  }, [roomId]);

  useEffect(() => {
    if(localVideoRef.current && localStreamRef.current) {
      attachStreamToVideo(localVideoRef.current, localStreamRef.current);
    }
  }, [localVideoRef.current]);

  const createPeerConnection = (userId) => {
    console.log("creating peer connection for: ", userId);
    const peer = new RTCPeerConnection(configuration);

    if(localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        console.log("Adding tracks to peer connection : ", track.kind);
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peer.onicecandidate = (event) => {
      if(event.candidate) {
        console.log("Sending ice candidate");
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          to: userId
        });
      }
    };

    peer.onconnectionstatechange = () => {
      console.log(`Connection state for ${userId}: `, peer.iceConnectionState);
    }

    peer.ontrack = (event) => {
      console.log("Receiving remote tracks: ", event.track.kind);
      const remoteStream = event.streams[0];
      if(remoteStream) {
        setStreams(prev => new Map(prev.set(userId, remoteStream)));
      }
    };

    peers.set(userId, peer);
    return peer;
  };

  const handleUserJoined = async(userId) => {
    console.log("New user joined: ", userId);
    const peer = createPeerConnection(userId);

    try {
      const offer = await peer.createOffer();
      console.log("creating offer: ", offer.type);
      await peer.setLocalDescription(offer);
      socketRef.current.emit("offer", { offer, to: userId});
    } catch (error) {
      console.error("Error while creating offer : ", error)
    }
  };

  const handlerExistingParticipants = async(userIds) => {
    console.log("Existing participants: ", userIds);
    for (const userId in userIds) {
      const peer = createPeerConnection(userId);

      try {
        const offer = await peer.createOffer();
        console.log("creating offer for existing participant: ", offer.type);
        await peer.setLocalDescription(offer);
        socketRef.current.emit("offer", { offer, to: userId });
      } catch (error) {
        console.error("Error while creating offer for existing participant : ", error);
      }
      const offer =  await peer.createOffer();
      await peer.setLocalDescription(offer);
      socketRef.current.emit('offer', { offer, to: userId });
    }
  };

  const handleOffer = async({ offer, from }) => {
    console.log("received offer from: ", from);
    const peer = createPeerConnection(from);
    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socketRef.current.emit('answer', { answer, to: from });
    } catch (error) {
      console.error("Error while handling offer: ", error);
    }
  };

  const handleAnswer = async({ answer, from }) => {
    console.log("received answer from : ", from);
    const peer = peers.get(from);
    if(peer) {
      try {
        if(peer.signalingState === 'have-local-offer') {
          await peer.setRemoteDescription(new RTCSessionDescription(answer));
        } else {
          console.log("Peer connection not in correct state: ", peer.signalingState);
        }
      } catch (error) {
        console.error("Erro while handling answer :", error);
      }
    }
  };

  const handleIceCandidate = async({ candidate, from }) => {
    console.log("Receiving ICE candidate from: ", from);
    const peer = peers.get(from);
    if(peer) {
      try {
        await peer.addIceCandidate(new RTCSessionDescription(candidate));
      } catch (error) {
        console.error("Error while handeling ice candidate: ", error);
      }
    }
  };

  const handleUserLeft = (userId) => {
    console.log("user left: ", userId);
    const peer = peer.get(userId);
    if(peer){
      peer.close();
      peers.delete(userId);
    }

    setStreams(prev => {
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  };

  const cleanup = () => {
    peers.forEach(peer => peer.close());
    peers.clear();

    if(localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if(socketRef.current){
      socketRef.current.disconnect();
    }

    setIsConnected(false);
    setStreams(new Map());
    setHadLocalVideo(false);
  };

  const remoteStreams = streams.size > 0 ? Array.from(streams) : [];

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="relative">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-64 rounded-lg bg-gray-800 object-cover"
        />
        <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">You {!hasLocalVideo && '(No Video)'}</span>
      </div>
      {
        remoteStreams.map(([userId, stream]) => (
          <div key={userId} className="relative">
            <video
              autoPlay
              playsInline
              className="w-full h-64 rounded-lg bg-gray-800 object-cover"
              ref={el => stream && el && attachStreamToVideo(el, stream)}
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">Participant {userId.slice(0,4)}</span>
          </div>
        ))
      }
    </div>
  );

};

export default Room;