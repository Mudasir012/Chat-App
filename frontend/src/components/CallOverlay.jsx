import { useCallStore } from "../store/useCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, PhoneOff } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="bg-[var(--secondary-bg)] rounded-[2.5rem] border border-[var(--border)] overflow-hidden shadow-2xl shadow-black/40">
          {/* Content */}
          <div className="p-12 flex flex-col items-center gap-8">
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="size-32 rounded-[2rem] overflow-hidden border-4 border-[var(--accent)]/30 shadow-2xl shadow-[var(--accent)]/10">
                  <img
                    src={call.from?.profilePic || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(call.from?.fullName || "")}`}
                    alt=""
                    className="size-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 size-8 rounded-full bg-[var(--green)] flex items-center justify-center shadow-lg"
              >
                <Phone className="size-4 text-white" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{call.from?.fullName}</h2>
              <p className="text-sm text-[var(--text-muted)]">
                Incoming {call.type === "video" ? "Video Call" : "Voice Call"}
              </p>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-xs text-[var(--text-muted)]"
              >
                Ringing...
              </motion.p>
            </div>
          </div>

          {/* Controls */}
          <div className="px-12 pb-10 flex items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={acceptCall}
              className="size-16 rounded-full bg-gradient-to-br from-[var(--green)] to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-[var(--green)]/20 hover:shadow-xl hover:shadow-[var(--green)]/30 transition-all"
            >
              <Phone className="size-7" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={declineCall}
              className="size-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 transition-all"
            >
              <PhoneOff className="size-7" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CallOverlay;

