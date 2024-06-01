import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

/*
  Dictaphone function component, using Capacitor's speech recognition
  to let the user hear speak to the device and then it returns back the text.
  
  This is more of a demonstration, but what is supposed to be done is that
  it is combined into the editor as a seperate button for the user to dictate
  and insert into the editor as text.
*/

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