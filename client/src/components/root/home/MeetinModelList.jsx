import React from 'react'
import HomeCard from './HomeCard'
import MeetingModel from '../MeetingModel'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import api from '@/api/api'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@radix-ui/react-toast'
import { Input } from '@/components'
import { useSelector } from 'react-redux'
import useSocket from '@/api/socket/useSocket'




function MeetinModelList() {

  // --------------- Hooks and states --------------------

  const navigate = useNavigate();

  const [values, setValues] = useState({});
  const [callDetails, setcallDetails] = useState(false);
  const [meetingState, setMeetingState] = useState(undefined);

  const { toast } = useToast();

  const { userData } = useSelector(state => state.auth)

  const socket = useSocket();
  // ----------------- functinal definition ----------------

  const createInstantMeeting = async () => {
    try {
      const createResponse = await api.post('/rooms/create', {
        title: "Instant Meeting",
        startTime: new Date().toISOString(),
      });
      const roomId = createResponse.data.data._id;
      const userId = userData?._id;
      socket.on('connect', () => {
        console.log("Connected to server: ", socket.id);
      });
      socket.on('welcome', ({ message }) => {
        console.log(message);
      });
      const joinResponse = await api.post(`/rooms/join/${roomId}`);

      const joinRoomId = joinResponse.data.data._id;
      socket.emit("join-room", { joinRoomId, userId });
      socket.on('user-joined', ({userId}) => {
        console.log(`${userId}(You) just joined the room.`);
      })

      navigate(`/room/${joinRoomId}`);
      toast({title: "Meeting Created."});

      return () => {
        socket.off('connect');
        socket.off('welcome');
        socket.off("user-joined");
        socket.disconnect();
      }
    } catch (error) {
      console.log("Error while creating Instant meeting : ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't create Instant Meeting.",
        action: <ToastAction altText='try-again'>Try Again</ToastAction>
      });
    }
  }

  const joinRoom = async (roomId) => {
    try {
      const response = await api.post(`/rooms/join/${roomId}`);
      const joinedRoomId = response.data.data._id;
      const userId = userData?._id;
      socket.on("connect", () => {
        console.log("Connected to server: ", socket.id);
      });
      socket.on("welcome", ({message}) => {
        console.log(message)
      });
      socket.emit("join-room", { joinedRoomId, userId });
      socket.on('user-joined', ({userId}) => {
        console.log(`${userId} just joined the room`)
      });
      navigate(`/room/${joinedRoomId}`);
      return () => {
        socket.off("message");
        socket.off("user-joined");
        socket.off("connect");
        socket.disconnect();
      }
    } catch (error) {
      console.log("Error while joining Room: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't Join you Meeting.",
        action: <ToastAction altText='try-again'>Try Again</ToastAction>
      });
    }
  }

  const createMeeting = async () => {

    try {
      if(meetingState == 'isSchedulingMeeting' && (values.title == undefined || values.dateTime == undefined)) {
        toast({
          variant: "destructive",
          title: "Bhai Bhai Bhai !!",
          description: "Title and Timing are required.",
          action: <ToastAction altText='try again'>Try Again</ToastAction>
        })
        return
      }
      const response = await api.post('/rooms/create', {
        title: values.title || 'Instant Meeting',
        startTime: values.dateTime || (new Date().toISOString()),
      });
      const roomId = response.data.data._id;
      setValues({...values, link: roomId});
      toast({title: "Meeting Created Successfully"});
      setcallDetails(true);

    } catch (error) {
      console.log("Error while creating room: ", error);
      toast({
        variant: "desctuctive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with you request",
        action: <ToastAction altText='try again'>Try Again</ToastAction>
      })
    }
  }

  // -------------------- component -------------------------
  return (
  <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 '>
    <HomeCard
      img='/icons/add-meeting.svg'
      title='New Meeting'
      description='Start an instant meeting'
      className='bg-[#FF742E]'
      handleClick={() => setMeetingState('isInstantMeeting')}
    />
    <HomeCard
      img='/icons/schedule.svg'
      title='Schedule Meeting'
      description='Plan your meeting'
      className='bg-[#830EF9]'
      handleClick={() => setMeetingState('isSchedulingMeeting')}
    />
    <HomeCard
      img='/icons/recordings.svg'
      title='View Recordings'
      description='Check out your recordings'
      className='bg-[#F9A90E]'
      handleClick={() => {
        setMeetingState('isRecordingMeeting')
        navigate('/recordings')
      }}
    />
    <HomeCard
      img='/icons/join-meeting.svg'
      title='Join Meeting'
      description='Via invitation link'
      className='bg-[#0E78F9]'
      handleClick={() => setMeetingState('isJoiningMeeting')}
    />
    {
      !callDetails ?
      <MeetingModel
      isOpen={meetingState === 'isSchedulingMeeting'}
      onClosed={() => setMeetingState(undefined)}
      title="Create Meeting"
      handleClick={createMeeting}>
        <div className='flex flex-col gap-2.5'>
          <label className='text-base leading-[22px] text-sky-100 ' htmlFor="title-area">
            Add a Title
          </label>
          <Textarea className='title-area border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#252A41]' onChange={(e) => {
            setValues({...values, title: e.target.value})
          }} />
        </div>
        <div className='flex flex-col gap-2.5 w-full'>
          <label className='text-base leading-[22px] text-sky-100' htmlFor="datetimepick">
            Select Date and Time
          </label>
          <input className='w-full rounded bg-[#252A41] p-2 focus:outline-none' onChange={(date) => setValues({...values, dateTime: date.target.value})} type="datetime-local" name="datetime" id="datetimepick" />
        </div>
      </MeetingModel>
      :
      (
        <MeetingModel
        isOpen={meetingState === 'isSchedulingMeeting'}
        onClosed={() => setMeetingState(undefined)}
        title="Meeting Created"
        className="text-center text-white"
        handleClick={() => {
          navigator.clipboard.writeText(values.link)
            .then(() => {
              // throw Error
              toast({title: "Link Copied."});
            })
            .catch(() => {
              toast({
                variant: "destructive",
                title: "Uh oh! something went wrong",
                description: "Couldn't copy the link",
                action: <ToastAction altText='try again'>Try Again</ToastAction>
              })
            })
          setcallDetails(false);
        }}
        image="/icons/checked.svg"
        buttonIcon="/icons/copy.svg"
        buttonText="Copy Meeting Link" />
      )
    }

    <MeetingModel
    isOpen={meetingState === 'isJoiningMeeting'}
    onClosed={() => setMeetingState(undefined)}
    title="Paste Link Here"
    className="text-white text-center"
    buttonText="Join Meeting"
    handleClick={() => {
      joinRoom(values.link);
    }}>
      <Input
      placeholder="Meeting Link"
      onChange={(e) => {
        setValues({...values, link: e.target.value })
        console.log(values.link);
      }}
      />
    </MeetingModel>

    <MeetingModel
    isOpen={meetingState === 'isInstantMeeting'}
    onClosed={() => setMeetingState(undefined)}
    title="Start an Instant Meeting"
    className="text-center text-white"
    buttonText="Start Meeting"
    handleClick={createInstantMeeting} />
  </section>
  )
}

export default MeetinModelList