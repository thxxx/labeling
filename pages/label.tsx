import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Button, Checkbox, Input, Textarea, useToast } from "@chakra-ui/react";
import { useUserStore } from "@/store/useStore";
import { ItemType } from ".";
import { createClient } from "@supabase/supabase-js";
import { supabaseClient } from ".";
import { useLogStore } from "@/store/useLogStore";
import { Badge } from "@chakra-ui/react";

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
  const [info, setInfo] = useState("");
  const [howmany, setHowmany] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [ishard, setIshard] = useState(false);

  useEffect(() => {
    // console.log(itemEl);
    setAudioSrc(itemEl.audio_storage_link);
    setDescription(itemEl.description);
    setHowmany(itemEl.how_many);
    setIsDone(itemEl.is_done);
    setInfo(itemEl.extra_information);
  }, [itemEl]);

  const submitCaption = async () => {
    if (!isStart) {
      alert("Click Start Labeling Button before start labeling.");
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
        description: "You can modify if you want.",
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
      <p className="index">Index : {itemEl && itemEl.index}</p>
      <LabelTop>
        <div className="audio">
          {audioSrc && <audio controls src={audioSrc}></audio>}
        </div>
        <div
          className="status"
          style={{
            color: `${isDone ? "green" : "red"}`,
          }}>
          {isDone ? (
            <Badge colorScheme="green">Submitted</Badge>
          ) : (
            <Badge colorScheme="red">Not Done</Badge>
          )}
        </div>
      </LabelTop>
      <LabelBottom>
        <div className="desc">
          <p>Description</p>
          <Textarea
            rows={2}
            style={{
              background: `${
                isDone ? "rgba(220,230,250,1)" : "rgba(255,255,255,1)"
              }`,
            }}
            value={description || ""}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </div>
        <div className="desc">
          <p>Extra information</p>
          <Input
            value={info || ""}
            onChange={(e) => setInfo(e.currentTarget.value)}
          />
        </div>
        <div className="hard">
          <p>Cannot label</p>
          <Checkbox
            isChecked={ishard}
            onChange={(e) => {
              setIshard(!ishard);
            }}
          />
        </div>
      </LabelBottom>
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
  background:white;
  border:1px solid rgba(0,0,0,0.3);
  border-radius:8px;
  padding:15px;
  width:80%;
  margin:10px;

  .index{
    font-size:14px;
    color:rgba(60,60,60,1);
  }
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

const LabelBottom = styled.div`
  width:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;

  .desc{
    margin:10px 0px;
  }

  div{
    width:100%;
  }
  .hard{
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:start;
    align-items:center;
    margin:0px 0px 10px 0px;
    p{
      margin-right:10px;
    }
  }
`;
