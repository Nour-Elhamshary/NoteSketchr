import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";


const Dictaphone = () => {

    const [listening, setListening] = useState(false);
    const [myText, setText] = useState("");
    async function startRecognition(){
        const { available } = await SpeechRecognition.available();

        if (available) {
            setListening(true);
            SpeechRecognition.start({
                language: "en-US",
                partialResults: true,
                popup: false,
              });

              
              SpeechRecognition.addListener('partialResults', (data: any) => {
                console.log("partialResults was fired", data.matches);
                if (data.matches && data.matches.length > 0) {
                    setText(data.matches[0]);
              }
        });
        }
    }


    async function stopRecognition(){
        setListening(false);
        await SpeechRecognition.stop();
    }
  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <IonButton onClick={async () => startRecognition()}>Start</IonButton>
      <IonButton onClick={async () => stopRecognition()}>Stop</IonButton>
      <p>{myText}</p>
    </div>
  );
};
export default Dictaphone;