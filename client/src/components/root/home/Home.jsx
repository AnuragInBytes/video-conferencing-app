import React, { useEffect, useState } from 'react'
import HomeCard from './HomeCard';
import { useNavigate } from 'react-router-dom';
import MeetingModel from '../MeetingModel';
import useSocket from '@/api/useSocket';
import api from '@/api/api';
import { useSelector } from 'react-redux';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';

function Home() {

  const navigate = useNavigate();
  const [meetingState, setMeetingState] = useState('');
  const [callDetails, setcallDetails] = useState(false);
  const [values, setValues] = useState({});

  const { toast } = useToast();


  const now = new Date();
  const time = now.toLocaleTimeString('en-in', { hour: '2-digit', minute: '2-digit' })
  const date = (new Intl.DateTimeFormat('en-in', {dateStyle: 'full'})).format(now);

  const { userData } = useSelector((state) => state.auth)

  const createInstantMeeting = async () => {
    try {
      const socket = useSocket('http://localhost:5000');
      const response = await api.post('/rooms/create', {
        title: "Instant Meeting",
        startTime: now.toISOString(),
      });
      const roomId = response.data.data._id;
      const userId = userData?._id;
      socket.on('connect', () => {
        console.log("Connected to server: ", socket.id);
      });
      socket.on('reconnect_attempt', (attempt) => {
        console.log('Reconnection attempt: ', attempt);
      });
      const joinedResponse = await api.post(`/rooms/join/${roomId}`)

      const joinRoomId = joinedResponse.data.data._id;
      socket.emit("join-room", { joinRoomId, userId});

      navigate(`/room/${joinRoomId}`);
      toast({title: "Meeting Created",});

      return () => {
        socket.off('connect');
        socket.disconnect();
      }
    } catch (error) {
      console.log("Error while creating Instant Meeting: ", error);
      toast({
        variant: "desctuctive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with you request",
        action: <ToastAction altText='try again'>Try Again</ToastAction>
      })
    }
  }

  const createMeeting = async () => {

    try {
      if(values.title == undefined || values.dateTime == undefined) {
        toast({
          variant: "destructive",
          title: "Kya Yaar!!",
          description: "Title and Timing are required.",
          action: <ToastAction altText='try again'>Try Again</ToastAction>
        })
        return
      }
      const response = await api.post('/rooms/create', {
        title: values.title,
        startTime: values.dateTime,
      });
      toast({title: "Meeting Created Successfully"});
      setcallDetails(true)
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

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-[url("/images/hero-background.png")] bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='bg-[#ffffff40] backdrop-blur-[4px] max-w-[270px] rounded py-2 text-center text-base font-semibold'>
            Upcoming meeting at: 12:30 PM
          </h2>
          <div className='flex flex-col gap-2 '>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-bold text-[#c9ddff] lg:text-2xl '>{date}</p>
          </div>
        </div>
      </div>

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
            navigate('/lobby/recordings')
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
              <label className='text-base leading-[22px] text-sky-100 ' htmlFor="">
                Add a Title
              </label>
              <Textarea className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-[#252A41]' onChange={(e) => {
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
              navigator.clipboard.writeText('copycopy')
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
        isOpen={meetingState === 'isInstantMeeting'}
        onClosed={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center text-white"
        buttonText="Start Meeting"
        handleClick={createInstantMeeting} />
      </section>
    </section>
  )
}

export default Home