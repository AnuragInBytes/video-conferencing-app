import { toast } from "@/hooks/use-toast"
import useSocket from "./useSocket";
import { ToastAction } from "@radix-ui/react-toast";
import { useSelector } from "react-redux";



const createMeeting = async (title, startTime) => {

  if(title == undefined || startTime == undefined){
    toast({
      variant: "destructive",
      title: "Bhai Bhai Bhai!!!",
      description: "Title and Timing are required.",
      action: <ToastAction altText="try again">Try Again</ToastAction>
    });
    return
  }

  try {
    const response = await api.post('/rooms/create', {
      title: "Instant Meeting" || title,
      startTime: (new Date).toISOString() || startTime,
    })
    if(response) {
      toast({ title: "Meeting Registered Successfully" });
    }

  } catch (error) {
    console.log("Something went wrong while creating room", error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem creating room",
      action: <ToastAction altText="try again">Try Again</ToastAction>
    });
  }
}

const joinMeeting = async (roomId) => {
  try {
    const response = await api.post(`/rooms/join/${roomId}`);

    const joinRoomId = response.data.data._id;


  } catch (error) {
    console.log("Error while Joining Room : ", error);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem while joining room.",
      action: <ToastAction altText="try again">Try Again</ToastAction>
    })
  }
}

export { createMeeting, joinMeeting }