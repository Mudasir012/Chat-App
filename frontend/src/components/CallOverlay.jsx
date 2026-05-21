import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, PhoneOff } from "lucide-react";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useRef, useEffect } from "react";

const CallOverlay = () => {
  const { call, acceptCall, declineCall, endCall } = useCallStore();
  const { authUser } = useAuthStore();
  const containerRef = useRef(null);

  useEffect(() => {
    if (!call || call.status !== "connected" || !containerRef.current) return;

    const myMeeting = async () => {
      try {
        const appID = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

        if (!appID || !serverSecret) {
          console.error("ZegoCloud credentials missing in .env");
          return;
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          call.roomId,
          authUser._id,
          authUser.fullName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        
        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: call.type === "video",
          showPreJoinView: false,
          onLeaveRoom: () => {
            endCall();
          },
        });
      } catch (err) {
        console.error("Failed to initialize ZegoCloud:", err);
      }
    };

    myMeeting();
  }, [call, authUser, endCall]);

  if (!call) return null;

  if (call.status === "connected") {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-base-100 border-4 border-primary shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b-4 border-primary flex items-center justify-between bg-primary/10">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl overflow-hidden border-2 border-primary">
              <img src={call.from?.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(call.from?.fullName || "")}`} alt="" />
            </div>
            <div>
              <h2 className="font-black uppercase italic text-lg">{call.from?.fullName}</h2>
              <p className="text-xs font-bold uppercase opacity-60">
                Incoming {call.type === "video" ? "Video Call" : "Voice Call"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative bg-neutral flex items-center justify-center overflow-hidden">
          <div className="flex flex-col items-center gap-8">
             <div className="size-48 rounded-[3rem] overflow-hidden border-8 border-primary shadow-2xl animate-bounce">
                <img src={call.from?.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(call.from?.fullName || "")}`} alt="" className="size-full object-cover" />
             </div>
             <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-white uppercase italic">{call.from?.fullName}</h2>
               <p className="text-primary font-black uppercase tracking-widest animate-pulse">Ringing...</p>
             </div>
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-8 bg-base-100 flex items-center justify-center gap-6">
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
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;

