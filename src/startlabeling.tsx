import { useUserStore } from "@/store/useStore";
import { Button, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import FinishModal from "./finishModal";
import { createClient } from "@supabase/supabase-js";
import { useLogStore } from "@/store/useLogStore";
import LabelLogModal from "./labelLogs";
import { v4 as uuidv4 } from "uuid";

const supabaseClient = createClient(
  "https://hhvjxvsajsovyzgmfvgd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhodmp4dnNhanNvdnl6Z21mdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzU5NzIsImV4cCI6MjAxNzUxMTk3Mn0.PhRzPvkOCflUJ5hCVI4IZPzAXJMXwTZJdSVfPl1Q7Dk"
);

const Startlabeling = () => {
  const { isStart, id, setId, setIsStart } = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    logId,
    logNum,
    labelLogs,
    startedAt,
    setStartedAt,
    setLabelLogs,
    setLogId,
    setLogNum,
  } = useLogStore();

  useEffect(() => {
    (async () => {
      const { data, error } = await supabaseClient
        .from("labelingControl")
        .select()
        .eq("user_id", id);
      const unfinished_log = data?.filter((doc) => doc.finish_at === null);
      console.log("data : ", data, unfinished_log);
      if (data?.length === 0 || unfinished_log?.length === 0) {
      } else if (unfinished_log && unfinished_log.length > 0) {
        alert("Labeling log is detected. Continue labeling!");
        setIsStart(true);
        setLogId(unfinished_log[0].log_id);
        setLogNum(unfinished_log[0].label_num);
        setStartedAt(unfinished_log[0].start_at);
      }
    })();
  }, []);

  const startlabel = async () => {
    const newLogId = uuidv4();
    const body = {
      log_id: newLogId,
      user_id: id,
    };
    const { data, error } = await supabaseClient
      .from("labelingControl")
      .insert(body);
    setIsStart(true);
    setLogId(newLogId);
    setStartedAt(new Date());
  };

  const finishLabel = async () => {
    const body = {
      finish_at: new Date(),
    };
    const { data, error } = await supabaseClient
      .from("labelingControl")
      .update(body)
      .eq("user_id", id)
      .eq("log_id", logId);
    onClose();
  };

  return (
    <div>
      <Button
        colorScheme={isStart ? "red" : "green"}
        onClick={() => {
          if (isStart) {
            onOpen();
          } else {
            startlabel();
          }
        }}>
        {isStart ? "Stop" : "Start labeling"}
      </Button>
      <LabelLogModal />
      <FinishModal
        isOpen={isOpen}
        onClose={onClose}
        finishLabel={finishLabel}
      />
    </div>
  );
};

export default Startlabeling;
