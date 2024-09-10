import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useNavigate } from 'react-router-dom';
import MeetingModel from '../MeetingModel';

function Home() {
  const navigate = useNavigate();
  const [meetingState, setMeetingState] = useState('');
  const now = new Date();

  const time = now.toLocaleTimeString('en-in', { hour: '2-digit', minute: '2-digit' })
  const date = (new Intl.DateTimeFormat('en-in', {dateStyle: 'full'})).format(now);

  const createMeeting = () => {

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
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='Via invitation link'
        className='bg-[#0E78F9]'
        handleClick={() => setMeetingState('isJoiningMeeting')}
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
      <MeetingModel
      isOpen={meetingState === 'isInstantMeeting'}
      onClosed={() => setMeetingState(undefined)}
      title="Start an Instant Meeting"
      className="text-center text-white"
      buttonTest="Start Meeting"
      handleClick={createMeeting} />
    </section>
    </section>
  )
}

export default Home