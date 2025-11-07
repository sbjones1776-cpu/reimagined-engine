import React from "react";
// import { useQuery } from "@tanstack/react-query";
// // import { base44 } from "@/api/base44Client";
import MessageInbox from "../components/MessageInbox";

export default function Messages() {
  // Placeholder until backend is connected
  const user = null;

  /* const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  }); */

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <MessageInbox user={user} />;
}
