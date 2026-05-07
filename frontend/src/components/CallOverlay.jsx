import { useCallStore } from "../store/useCallStore";
import { Phone, Video, X, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const CallOverlay = () => {
  const { call, localStream, remoteStream, acceptCall, declineCall, endCall } = useCallStore();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!call) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-base-100 border-4 border-primary shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b-4 border-primary flex items-center justify-between bg-primary/10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl overflow-hidden border-2 border-primary">
              <img src={call.from?.profilePic || "https://ui-avatars.com/api/?name=" + call.from?.fullName} alt="" />
            </div>
            <div>
              <h2 className="font-black uppercase italic text-lg">{call.from?.fullName}</h2>
              <p className="text-xs font-bold uppercase opacity-60">
                {call.status === "ringing" ? "Incoming " : ""}
                {call.type === "video" ? "Video Call" : "Voice Call"}
              </p>
            </div>
          </div>
          {call.status === "connected" && (
             <div className="px-4 py-1 bg-green-500 text-white rounded-full font-black text-xs uppercase animate-pulse">
                Connected
             </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-neutral flex items-center justify-center overflow-hidden">
          {call.type === "video" ? (
            <>
              {/* Remote Video */}
              {remoteStream ? (
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-white font-black uppercase italic text-2xl animate-pulse">
                   Waiting for stream...
                </div>
              )}
              
              {/* Local Video Preview */}
              {localStream && (
                <div className="absolute bottom-6 right-6 w-48 aspect-video bg-black rounded-xl border-2 border-primary shadow-lg overflow-hidden">
                   <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-8">
               <div className="size-48 rounded-[3rem] overflow-hidden border-8 border-primary shadow-2xl animate-bounce">
                  <img src={call.from?.profilePic || "https://ui-avatars.com/api/?name=" + call.from?.fullName} alt="" className="size-full object-cover" />
               </div>
               <div className="text-center space-y-2">
                 <h2 className="text-4xl font-black text-white uppercase italic">{call.from?.fullName}</h2>
                 <p className="text-primary font-black uppercase tracking-widest animate-pulse">Voice Calling...</p>
               </div>
            </div>
          )}
        </div>

        {/* Footer / Controls */}
        <div className="p-8 bg-base-100 flex items-center justify-center gap-6">
          {call.status === "ringing" ? (
            <>
              <button 
                onClick={acceptCall}
                className="btn btn-circle btn-lg bg-green-500 hover:bg-green-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
              >
                <Phone className="size-6" />
              </button>
              <button 
                onClick={declineCall}
                className="btn btn-circle btn-lg bg-red-500 hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
              >
                <PhoneOff className="size-6" />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`btn btn-circle btn-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isMuted ? "bg-red-500 text-white" : "bg-base-200"}`}
              >
                {isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
              </button>
              
              {call.type === "video" && (
                <button 
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`btn btn-circle btn-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isVideoOff ? "bg-red-500 text-white" : "bg-base-200"}`}
                >
                  {isVideoOff ? <VideoOff className="size-6" /> : <Video className="size-6" />}
                </button>
              )}

              <button 
                onClick={endCall}
                className="btn btn-circle btn-lg bg-red-500 hover:bg-red-600 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white"
              >
                <PhoneOff className="size-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
