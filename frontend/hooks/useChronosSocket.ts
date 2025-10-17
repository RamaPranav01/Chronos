// hooks/useChronosSocket.ts
import { useState, useEffect, useRef } from 'react';
import { AgentStep, MissionRequest } from '@/lib/types';

const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL!;

export const useChronosSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [finalReport, setFinalReport] = useState<AgentStep | null>(null);
  const [isMissionRunning, setIsMissionRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection established.');
      setIsConnected(true);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
      if (isMissionRunning) {
        setError("Connection lost. Mission aborted.");
        setIsMissionRunning(false);
      }
    };

    socket.onmessage = (event) => {
      try {
        const message: AgentStep = JSON.parse(event.data);
        setAgentSteps((prev) => [...prev, message]);

        if (message.step_type === 'FINAL_REPORT') {
          setFinalReport(message);
          setIsMissionRunning(false);
        } else if (message.step_type === 'ERROR') {
          setError(message.payload.message);
          setFinalReport(null);
          setIsMissionRunning(false);
        }
      } catch (err) {
        console.error('Failed to parse incoming message:', event.data);
        setError("Received an invalid message from the server.");
        setIsMissionRunning(false);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError("Failed to connect to the mission server.");
      setIsConnected(false);
      setIsMissionRunning(false);
    };

    return () => {
      socket.close();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const sendMission = (mission: MissionRequest) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // Reset state for a new mission
      setAgentSteps([]);
      setFinalReport(null);
      setError(null);
      setIsMissionRunning(true);
      socketRef.current.send(JSON.stringify(mission));
    } else {
      setError("Cannot start mission: not connected to the server.");
    }
  };

  return { isConnected, agentSteps, finalReport, isMissionRunning, error, sendMission };
};