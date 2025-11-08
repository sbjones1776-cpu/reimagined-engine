import React from "react";
import MessageInbox from "../components/MessageInbox";
import { useFirebaseUser } from '@/hooks/useFirebaseUser';

export default function Messages() {
  const { user, loading } = useFirebaseUser();

  if (loading) {
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
