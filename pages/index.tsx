import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useStore";
import Label from "./label";
import styled from "@emotion/styled";
import { Button, Input, useDisclosure } from "@chakra-ui/react";
import Ontology from "@/src/ontology";
import { createClient } from "@supabase/supabase-js";
import Startlabeling from "@/src/startlabeling";
import { useLogStore } from "@/store/useLogStore";

export const supabaseClient = createClient(
  "https://hhvjxvsajsovyzgmfvgd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhodmp4dnNhanNvdnl6Z21mdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzU5NzIsImV4cCI6MjAxNzUxMTk3Mn0.PhRzPvkOCflUJ5hCVI4IZPzAXJMXwTZJdSVfPl1Q7Dk"
);

const ROWS_PER_PAGE = 10;

type UserInformation = {
  id: string;
  name: string;
  remain_num: number;
};

const USER_INFORMATIONS: UserInformation[] = [
  {
    id: "test",
    name: "호진",
    remain_num: 30,
  },
];

export type ItemType = {
  audio_storage_link: string;
  how_many: number;
  index: number;
  isDone: boolean;
  hardtocap: boolean;
  description: string;
  audio_id: string;
  userId: string;
  last_modified_time: null | Date;
};

const dummy: ItemType = {
  audio_storage_link:
    "https://hpxjdveijpuehyuykkos.supabase.co/storage/v1/object/public/labeling_data/dwrew.wav",
  description: "",
  how_many: 0,
  audio_id: "zxc",
  index: 0,
  userId: "",
  isDone: false,
  hardtocap: false,
  last_modified_time: null,
};

export default function Home() {
  const {
    id,
    isLoggedIn,
    allDatas,
    isStart,
    setIsStart,
    setAllDatas,
    setIsLoggedIn,
    setId,
  } = useUserStore();
  const { logId, logNum, setLogId, setLogNum } = useLogStore();
  const [user, setUser] = useState<UserInformation>();
  const [page, setPage] = useState<number>(1);
  const [maxpage, setMaxpage] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5]);
  const [items, setItems] = useState<ItemType[]>([]);
  const [maxIndex, setMaxIndex] = useState(-1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // loadAudios();
  }, []);

  const submitId = (inputId: string) => {
    const userFind = USER_INFORMATIONS.filter((doc) => doc.id === inputId);
    if (userFind.length > 0) {
      setIsLoggedIn(true);
      setUser(userFind[0]);
      loadAudios();
    } else {
      console.log("wrong!");
    }
  };

  const clickPage = (item: number) => {
    setPage(item);
    setPages([
      item - 3,
      item - 2,
      item - 1,
      item,
      item + 1,
      item + 2,
      item + 3,
    ]);
  };

  const loadAudios = async () => {
    console.log("load more datas ", allDatas.length);
    const { data, error } = await supabaseClient
      .from("labels")
      .select("*")
      .eq("user_id", id)
      .eq("is_done", false)
      .gt("index", maxIndex)
      .limit(10);
    console.log(data);
    if (data) {
      const max_index = data.sort((a, b) => b.index - a.index)[0].index;
      setMaxIndex(max_index);
      setItems(data);
      setAllDatas([...allDatas, ...data]);
    }
    // supabase에서 유저 id로, 아직 안한 것들 중 index 작은 순서대로 10개 불러오기
    // const datas = [
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    //   dummy,
    // ];
    // setItems(datas);
    // setAllDatas([...allDatas, ...datas]);
  };

  return (
    <main>
      {isLoggedIn && user ? (
        <div>
          <Ontology isOpen={isOpen} onClose={onClose} />
          <FloatingButton
            onClick={() => {
              onOpen();
            }}>
            ontology보기
          </FloatingButton>
          <div>Hello Welcome {user.name}</div>
          <div>Ontology : </div>
          <p>There are rules.</p>
          <Startlabeling />
          <p>Current labeled num : {logNum}</p>
          {items.map((itemEl, idx) => {
            return <Label key={idx} itemEl={itemEl} />;
          })}
          <PagesContainer>
            {page > 1 && (
              <Button
                onClick={() => {
                  const rows = allDatas.slice(
                    (page - 1) * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE
                  );
                  setItems(rows);
                  setPage(page - 1);
                }}>
                Prev rows
              </Button>
            )}
            <span>page : {page}</span>
            <Button
              onClick={() => {
                if (logNum < (page * ROWS_PER_PAGE) / 2) {
                  alert(
                    "You have to label at least half of the previous audios!"
                  );
                  return;
                }
                if (page === maxpage) {
                  setMaxpage(maxpage + 1);
                  setPage(page + 1);
                  loadAudios();
                } else {
                  const rows = allDatas.slice(
                    page * ROWS_PER_PAGE,
                    page * ROWS_PER_PAGE + 10
                  );
                  setPage(page + 1);
                  setItems(rows);
                }
              }}>
              Next rows
            </Button>
          </PagesContainer>
        </div>
      ) : (
        <div>
          <p>Type your id</p>
          <Input onChange={(e) => setId(e.currentTarget.value)} value={id} />
          <Button onClick={() => submitId(id)}>enter</Button>
        </div>
      )}
    </main>
  );
}

const PagesContainer = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  width:100%;
  margin:15px 0px;

  .page{
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    width:50px;
    height:50px;
    margin:10px;
    padding:10px;
    border-radius:6px;

    &:hover{
      background:blue;
    }
  }
`;

const FloatingButton = styled.div`
  position:fixed;
  bottom:10px;
  right:10px;
  width:150px;
  height:70px;
  border-radius:6px;
  background:rgba(10,10,10,1);
  color:white;
  cursor:pointer;
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
`;
