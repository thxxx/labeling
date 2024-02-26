import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Button, Checkbox, Input, Textarea, useToast } from "@chakra-ui/react";
import { useUserStore } from "@/store/useStore";
import { ItemType } from ".";
import { createClient } from "@supabase/supabase-js";
import { supabaseClient } from ".";
import { useLogStore } from "@/store/useLogStore";

type LabelProps = {
  itemEl: ItemType;
};

const Label = ({ itemEl }: LabelProps) => {
  // Create a single supabase client for interacting with your database
  const { id, isStart } = useUserStore();
  const { logId, logNum, setLogId, setLogNum } = useLogStore();
  const toast = useToast();
  // id로 슈파베이스에서 읽어오기
  const [audioSrc, setAudioSrc] = useState("");
  const [description, setDescription] = useState("");
  const [howmany, setHowmany] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [ishard, setIshard] = useState(false);

  useEffect(() => {
    // console.log(itemEl);
    setAudioSrc(itemEl.audio_storage_link);
    setDescription(itemEl.description);
    setHowmany(itemEl.how_many);
    setIsDone(itemEl.isDone);
  }, []);

  const submitCaption = async () => {
    if (!isStart) {
      alert("Click Start Labeling Button before labeling!");
      return;
    }
    if (description.length > 5 || ishard) {
      const body = {
        description: description,
        is_hard: ishard,
        last_modified_time: new Date(),
        is_done: true,
      };
      const { data, error } = await supabaseClient
        .from("labels")
        .update(body)
        .eq("audio_id", itemEl.audio_id)
        .eq("user_id", id);
      console.log(data, error);

      setIsDone(true);
      toast({
        title: "Submit Succeeded",
        description: "You can re",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      if (!isDone) {
        // 새로 라벨링한거
        const logBody = {
          label_num: logNum + 1,
        };
        await supabaseClient
          .from("labelingControl")
          .update(logBody)
          .eq("user_id", id)
          .eq("log_id", logId);
        setLogNum(logNum + 1);
        console.log("새로 라벨링. 수정 X");
      }
    } else {
      toast({
        title: "Submit Failed",
        description: "You should type longer than 5 letters",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <LabelContainer>
      <p>Index : {itemEl.index}</p>
      <LabelTop>
        <div>{audioSrc && <audio controls src={audioSrc}></audio>}</div>
        <div
          className="status"
          style={{
            color: `${isDone ? "green" : "red"}`,
          }}>
          {isDone ? "Submitted" : "Not yet"}
        </div>
      </LabelTop>
      <div>
        <div>
          <p>Description</p>
          <Textarea
            style={{
              background: `${
                isDone ? "rgba(220,230,250,1)" : "rgba(255,255,255,1)"
              }`,
            }}
            value={description || ""}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </div>
        <div>
          <p>Cannot label</p>
          <Checkbox
            isChecked={ishard}
            onChange={(e) => {
              setIshard(!ishard);
            }}
          />
        </div>
      </div>
      <div>
        <Button w={300} onClick={() => submitCaption()}>
          {isDone ? "Update" : "Submit"}
        </Button>
      </div>
    </LabelContainer>
  );
};

export default Label;

const LabelContainer = styled.div`
    border:1px solid black;
    border-radius:8px;
    padding:15px;
    width:80%;
    margin:10px;
`;

const LabelTop = styled.div`
  width:100%;
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;

  .status{
    
  }
`;
