// Destination: components/VoiceRecorder.jsx
'use client';

import { useState, useRef } from 'react';
import { sessionHeaders } from '@/lib/session';

export default function VoiceRecorder({ onTranscriptionComplete, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  async function startRecording() {
    setErrorMessage('');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Audio recording is not supported in this browser.');
      return;
    }

    if (typeof window !== 'undefined' && 'permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        if (permissionStatus.state === 'denied') {
          setErrorMessage('Microphone access is blocked in your browser settings.');
          return;
        }
      } catch (err) {
        // Safari/Firefox often can't query 'microphone' — fall through and let getUserMedia prompt directly
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = handleRecordingStop;

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Microphone permission denied.');
      } else if (err.name === 'NotFoundError') {
        setErrorMessage('No microphone found on this device.');
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        setErrorMessage('Microphone access requires a secure (https) connection.');
      } else {
        setErrorMessage('Could not connect to microphone.');
      }
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  async function handleRecordingStop() {
    streamRef.current?.getTracks().forEach((track) => track.stop());

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    audioChunksRef.current = [];

    if (audioBlob.size === 0) {
      setErrorMessage('No audio captured. Please try again.');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: sessionHeaders(),
        body: formData,
      });

      if (!res.ok) throw new Error('Transcription failed');

      const data = await res.json();
      onTranscriptionComplete?.(data.text);
    } catch (err) {
      console.error('Transcription error:', err);
      setErrorMessage('Could not process your recording. Please try typing instead.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1.5px solid #B99B5B',
          backgroundColor: isRecording ? '#DC3545' : 'rgba(185, 155, 91, 0.15)',
          color: isRecording ? '#FFFFFF' : '#D9C489',
          fontWeight: 600,
          fontSize: '14px',
          cursor: disabled || isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {isProcessing ? 'Processing...' : isRecording ? '⏹ Stop Recording' : '🎤 Record Voice Reflection'}
      </button>

      {errorMessage && (
        <p style={{ color: '#FF6B6B', fontSize: '12px', marginTop: '6px', textAlign: 'center' }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}