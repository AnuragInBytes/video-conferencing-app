import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'


function MeetingModel({
  isOpen,
  onClosed,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClosed}>
      {/* <DialogTrigger>Heelo</DialogTrigger> */}
      <DialogContent className='flex w-full max-w-[520px] flex-col gap-6 border-none bg-[#1c1f2e] px-6 py-9 text-white'>
        <DialogHeader>
          <DialogTitle>
            <div className='flex flex-col gap-6 '>
              {image && (
                <div className='flex justify-center'>
                  <img src={image} alt="image" width={72} height={72} />
                </div>
              )}
              <h1 className={`text-3xl font-bold leading-[42px] ${className}`}>{title}</h1>
              {children}
            </div>
          </DialogTitle>
          <DialogDescription className='flex items-center justify-center'>
            <Button className='bg-blue-500 focus-visible:right-0 focus-visible:ring-offset-0' onClick={handleClick}>
              {buttonIcon && <img src={buttonIcon} alt='button' width={13} height={13}  />} &nbsp;
              {buttonText || "Schedule Meeting"}
            </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default MeetingModel