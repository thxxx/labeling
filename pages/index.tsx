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
import Login from "@/src/login";

export const supabaseClient = createClient(
  "https://hhvjxvsajsovyzgmfvgd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhodmp4dnNhanNvdnl6Z21mdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzU5NzIsImV4cCI6MjAxNzUxMTk3Mn0.PhRzPvkOCflUJ5hCVI4IZPzAXJMXwTZJdSVfPl1Q7Dk"
);

const ROWS_PER_PAGE = 10;

export type ItemType = {
  audio_storage_link: string;
  how_many: number;
  index: number;
  is_done: boolean;
  hardtocap: boolean;
  description: string;
  audio_id: string;
  user_id: string;
  last_modified_time: null | Date;
  extra_information: string;
};

const dummy: ItemType = {
  audio_storage_link:
    "https://hpxjdveijpuehyuykkos.supabase.co/storage/v1/object/public/labeling_data/dwrew.wav",
  description: "",
  how_many: 0,
  audio_id: "zxc",
  index: 0,
  user_id: "",
  is_done: false,
  hardtocap: false,
  last_modified_time: null,
  extra_information: "",
};

export default function Home() {
  const { id, isLoggedIn, allDatas, user, setAllDatas } = useUserStore();
  const { logId, logNum, startedAt, setLogNum } = useLogStore();
  const [page, setPage] = useState<number>(1);
  const [maxpage, setMaxpage] = useState<number>(1);
  const [prevCount, setPrevCount] = useState<number>(0);
  const [items, setItems] = useState<ItemType[]>([]);
  const [maxIndex, setMaxIndex] = useState(-1);
  const [minIndex, setMinIndex] = useState(100000);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // loadAudios();
  }, []);

  const previousLabelAudios = async () => {
    const { data, error } = await supabaseClient
      .from("labels")
      .select("*")
      .eq("user_id", id)
      .eq("is_done", true)
      .lt("index", minIndex)
      .order("index", { ascending: false })
      .limit(10);
    console.log("prev data : ", data);
    if (data && data.length > 0) {
      const min_index = data.sort((a, b) => a.index - b.index)[0].index;
      setMinIndex(min_index);
      const added_list = [...data.sort((a, b) => a.index - b.index)];
      while (added_list.length < 10) {
        // 배열에 빈 값을 추가
        added_list.push(null); // 또는 다른 값을 사용할 수 있습니다 (예: null, '')
      }
      setItems(added_list);
      setAllDatas([...added_list, ...allDatas]);
      setPage(page - 1);
      setPrevCount(prevCount + 1);
    } else {
      setMinIndex(0);
    }
  };

  const loadAudios = async () => {
    // console.log("load more datas ", allDatas.length);
    // const { data, error } = await supabaseClient
    //   .from("labels")
    //   .select("*")
    //   .eq("user_id", id)
    //   .eq("is_done", false)
    //   .gt("index", maxIndex)
    //   .order("index", { ascending: true })
    //   .limit(10);
    // if (data && data.length > 0) {
    //   const max_index = data.sort((a, b) => b.index - a.index)[0].index;
    //   setMaxIndex(max_index);
    //   setItems(data.sort((a, b) => a.index - b.index));
    //   setAllDatas([...allDatas, ...data]);
    // }
    // supabase에서 유저 id로, 아직 안한 것들 중 index 작은 순서대로 10개 불러오기
    const datas = [
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
      dummy,
    ];
    setItems(datas);
    setAllDatas([...allDatas, ...datas]);
  };

  return (
    <Main>
      {isLoggedIn && user ? (
        <div>
          <Ontology isOpen={isOpen} onClose={onClose} />
          <FloatingButton
            onClick={() => {
              onOpen();
            }}>
            Check labeling instruction
          </FloatingButton>
          <IndexTopContainer>
            <p>Hello Welcome</p>
            <p>
              Check this guide when you do labeling :{" "}
              <span
                className="a"
                onClick={() => {
                  window.open(
                    "https://www.notion.so/Test-Notion-Page-df374670f9f2413da5ad077b990fd9ca"
                  );
                }}>
                Guide link
              </span>
            </p>
            <p>Current labeled num : {logNum}</p>
            <Startlabeling />
            {startedAt && (
              <p>
                Current labeling is started at :{" "}
                <span className="date">
                  {startedAt &&
                    new Date(startedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                </span>
              </p>
            )}
          </IndexTopContainer>
          {items.map((itemEl, idx) => {
            if (itemEl) {
              return <Label key={idx} itemEl={itemEl} />;
            }
          })}
          <PagesContainer>
            {page > 1 ? (
              <Button
                onClick={() => {
                  const rows = allDatas.slice(
                    (page + prevCount - 2) * ROWS_PER_PAGE,
                    (page + prevCount - 1) * ROWS_PER_PAGE
                  );
                  setItems(rows);
                  setPage(page - 1);
                }}>
                Prev rows
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (minIndex === 0) {
                    alert("No previous labeled data!");
                    return;
                  }
                  previousLabelAudios();
                }}>
                Check previous labeled datas
              </Button>
            )}
            <span className="pageNum">page {page}</span>
            <Button
              onClick={() => {
                if (logNum < (page * ROWS_PER_PAGE) / 2 - 1) {
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
                    (page + prevCount) * ROWS_PER_PAGE,
                    (page + prevCount) * ROWS_PER_PAGE + 10
                  );
                  setPage(page + 1);
                  setItems(rows);
                }
              }}>
              Next 10 rows
            </Button>
          </PagesContainer>
        </div>
      ) : (
        <Login loadAudios={() => loadAudios()} />
      )}
    </Main>
  );
}

const Main = styled.main`
  padding:16px;
  background:rgba(200,200,210,0.1);
`;

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
  .pageNum{
    padding:8px 10px;
    background:rgba(190,230,190,0.6);
    font-weight:700;
    border-radius:6px;
    margin:0px 5px;
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
  text-align:center;
`;

const IndexTopContainer = styled.div`
  padding:20px;
  border-radius:6px;
  background:white;

  .a{
    &:hover{
      color:rgba(30,30,30,1);
    }
    cursor:pointer;
    text-decoration:underline;
    color:rgba(90,90,90,1);
  }
  p{
    margin:10px 0px;
    font-size:18px;
  }

  .date{
    color:rgba(90,90,90,1);
    font-size:16px;
  }
`;
