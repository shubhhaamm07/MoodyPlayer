import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facial-expression.css";
export default function ExpressionDetector() {
  const videoRef = useRef();
  const intervalRef = useRef(null);

  const [expression, setExpression] = useState("Click Detect Mood");
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);

  // Start camera
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error(err));
  };

  // Detect expressions
  const detectExpressions = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (detections?.expressions) {
      const expressions = detections.expressions;

      const maxExpression = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b,
      );

      setExpression(maxExpression);
      setConfidence((expressions[maxExpression] * 100).toFixed(2));
    }
  };

  // Button Logic 🎯
  const handleDetection = () => {
    if (isDetecting) {
      // Stop detection
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      setExpression("Detection Stopped");
      setConfidence(0);
    } else {
      // Start detection
      intervalRef.current = setInterval(detectExpressions, 500);
    }

    setIsDetecting(!isDetecting);
  };

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      startVideo();
    };

    loadModels();

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="mood-element">
      <div>
        <video ref={videoRef} autoPlay muted className="user-video-feed" />
        <h2>Expression: {expression}</h2>
      </div>

      <button onClick={handleDetection}>
        {isDetecting ? "Stop Detection" : "Detect Mood"}
      </button>
    </div>
  );
}
