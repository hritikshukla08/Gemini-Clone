// import { createContext, useState } from "react";
// import runChat from "../config/gemini";

// export const Context = createContext();

// const ContextProvider = (props) => {
//   const [input, setInput] = useState("");
//   const [recentPrompt, setRecentPrompt] = useState("");
//   const [prevPrompts, setPrevPrompts] = useState([]);
//   const [showResult, setShowResult] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [resultData, setResultData] = useState("");

//   const delayPara = (index,nextWord)=>{
//     setTimeout(function(){
//         setResultData(prev=>prev+nextWord);
//     },75*index)
//   }
// const cleanResponse = (response) => {
//     // Remove unwanted text
//     let cleanedResponse = response.replace(/unwanted text/g, ""); // Adjust the regex as needed
//     // Replace hash symbols with desired formatting
//     cleanedResponse = cleanedResponse.replace(/##(.*?)##/g, "<b>$1</b>");
//     // Replace line breaks with <br> tags
//     cleanedResponse = cleanedResponse.replace(/\n/g, "<br>");
//     return cleanedResponse;
//   };
//   const onSent = async (prompt) => {
//     setResultData("")
//     setLoading(true)
//     setShowResult(true)
//     setRecentPrompt(input)
//     setPrevPrompts(prev=>[...prev,input])
//     const response = await runChat(input)
//     let responseArray = response.split("**");
//     let newResponse="";
//     for (let i=0;i<responseArray.length;i++)
//         {
//             if(i===0||i%2!==1){
//                 newResponse+=responseArray[i];
//             }
//             else{
//                 newResponse+="<b>"+responseArray[i]+"</b>";
//             }
//         }
//         let newResponse2 = newResponse.split("*").join("</br>")
//     // setResultData(newResponse2)
//     let newRespnseArray = newResponse2.split(" ");
//     for(let i =0;i<newRespnseArray.length;i++){
//         const nextWord = newRespnseArray[i]
//         delayPara(i,nextWord+" ")
//     }
//     setLoading(false)
//     setInput("")
    
  
//   };

//   const contextValue = {
//     prevPrompts,
//     setPrevPrompts,
//     onSent,
//     setRecentPrompt,
//     recentPrompt,
//     showResult,
//     loading,
//     resultData,
//     input,
//     setInput,
//   };

//   return (
//     <Context.Provider value={contextValue}>
//       {props.children}
//     </Context.Provider>
//   );
// };

// export default ContextProvider;

import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = ()=>{
    setLoading(false)
    setShowResult(false)
  }

  const cleanResponse = (response) => {
    // Remove unwanted text
    let cleanedResponse = response.replace(/unwanted text/g, ""); // Adjust the regex as needed
    // Remove ##
    cleanedResponse = cleanedResponse.replace(/##/g, "");
    // Replace **text** with <b>text</b> for bold formatting
    cleanedResponse = cleanedResponse.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    // Remove single asterisks (*)
    cleanedResponse = cleanedResponse.replace(/\*/g, "");
    // Replace line breaks with <br> tags if needed
    cleanedResponse = cleanedResponse.replace(/\n/g, "<br>");
    return cleanedResponse;
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt!==undefined){
      response=await runChat(prompt);
      setRecentPrompt(prompt)
    }
    else{
      setPrevPrompts(prev=>[...prev,input])
      setRecentPrompt(input)
      response = await runChat(input)
    }
    
    // Clean the response
    const cleanedResponse = cleanResponse(response);

    // Split cleaned response into words for delayed display
    const responseArray = cleanedResponse.split(" ");
    for (let i = 0; i < responseArray.length; i++) {
      const nextWord = responseArray[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
