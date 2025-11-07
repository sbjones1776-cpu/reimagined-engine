import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { base44 } from "@/api/base44Client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Clock, AlertTriangle, Lock } from "lucide-react";
import { format } from "date-fns";

export default function TimeTracker({ operation = null }) {
  const [timeUsedToday, setTimeUsedToday] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const { data: user, refetch: refetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
  });

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  
  const parentalControls = user?.parental_controls || {};
  const dailyUsageTracking = user?.daily_usage_tracking || {};
  const todayUsage = dailyUsageTracking[todayKey] || { total_minutes: 0, by_operation: {} };

  const dailyLimit = parentalControls.daily_time_limit_minutes || 0;
  const enforceTimeLimits = parentalControls.enforce_time_limits !== false;
  const warningThreshold = parentalControls.time_limit_warning_minutes || 5;
  const operationLimits = parentalControls.time_limits_by_operation || {};

  useEffect(() => {
    if (!enforceTimeLimits || dailyLimit === 0) return;

    const totalUsed = todayUsage.total_minutes || 0;
    setTimeUsedToday(totalUsed);

    // Check if time limit reached
    if (totalUsed >= dailyLimit) {
      setIsLocked(true);
    }
    // Check if warning threshold reached
    else if (dailyLimit - totalUsed <= warningThreshold && dailyLimit - totalUsed > 0) {
      setShowWarning(true);
    }

    // Check operation-specific limits
    if (operation && operationLimits[operation]) {
      const opUsed = todayUsage.by_operation?.[operation] || 0;
      if (opUsed >= operationLimits[operation]) {
        setIsLocked(true);
      }
    }
  }, [user, operation, enforceTimeLimits, dailyLimit, warningThreshold, operationLimits]);

  // Track time while playing
  useEffect(() => {
    if (!enforceTimeLimits || isLocked) return;

    const interval = setInterval(async () => {
      const newTotalMinutes = Math.floor((todayUsage.total_minutes || 0) + 1/60);
      const newOpMinutes = operation 
        ? Math.floor(((todayUsage.by_operation?.[operation] || 0) + 1/60))
        : 0;

      const updatedTracking = {
        ...dailyUsageTracking,
        [todayKey]: {
          total_minutes: newTotalMinutes,
          by_operation: {
            ...(todayUsage.by_operation || {}),
            ...(operation ? { [operation]: newOpMinutes } : {})
          }
        }
      };

      try {
        await base44.auth.updateMe({
          daily_usage_tracking: updatedTracking
        });
        await refetchUser();
      } catch (error) {
        console.error('Error updating time tracking:', error);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [enforceTimeLimits, isLocked, operation, todayUsage, dailyUsageTracking, refetchUser]);

  if (!enforceTimeLimits || dailyLimit === 0) {
    return null; // No time limits active
  }

  const remainingMinutes = Math.max(0, dailyLimit - timeUsedToday);
  const remainingOperationMinutes = operation && operationLimits[operation]
    ? Math.max(0, operationLimits[operation] - (todayUsage.by_operation?.[operation] || 0))
    : null;

  if (isLocked) {
    return (
      <Alert className="mb-6 bg-red-50 border-red-300">
        <Lock className="w-5 h-5 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong className="block mb-2">Time Limit Reached</strong>
          You've used your allotted time for today. Come back tomorrow to continue learning!
          {operation && remainingOperationMinutes === 0 && operationLimits[operation] && (
            <p className="mt-2 text-sm">
              {operation} time limit: {operationLimits[operation]} minutes reached
            </p>
          )}
          <div className="mt-3 text-sm text-gray-600">
            Time resets at midnight. See you tomorrow! 🌙
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (showWarning && remainingMinutes <= warningThreshold) {
    return (
      <Alert className="mb-6 bg-yellow-50 border-yellow-300">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong className="block mb-2">Time Running Out!</strong>
          You have <strong>{remainingMinutes} minutes</strong> left to play today.
          {operation && remainingOperationMinutes !== null && remainingOperationMinutes < remainingMinutes && (
            <p className="mt-2">
              {operation}: <strong>{remainingOperationMinutes} minutes</strong> left
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Subtle time display when not at warning threshold
  return (
    <div className="mb-4 flex items-center justify-end gap-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <span>{remainingMinutes} minutes remaining today</span>
    </div>
  );
}
