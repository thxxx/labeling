import { UserInformation, useUserStore } from "@/store/useStore";
import { Button, Input } from "@chakra-ui/react";
import React from "react";
import styled from "@emotion/styled";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  "https://hhvjxvsajsovyzgmfvgd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhodmp4dnNhanNvdnl6Z21mdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzU5NzIsImV4cCI6MjAxNzUxMTk3Mn0.PhRzPvkOCflUJ5hCVI4IZPzAXJMXwTZJdSVfPl1Q7Dk"
);

const Login = ({ loadAudios }: { loadAudios: () => void }) => {
  const { id, setUser, setIsLoggedIn, setId } = useUserStore();

  const submitId = async (inputId: string) => {
    const { data, error } = await supabaseClient
      .from("labelUser")
      .select()
      .eq("user_id", inputId);
    if (data && data.length > 0) {
      setIsLoggedIn(true);
      setUser(data[0]);
      loadAudios();
      console.log(inputId, data[0]);
    } else {
      alert("wrong id");
      console.log("wrong!");
    }
  };

  return (
    <LoginContainer>
      <form
        className="inner"
        onSubmit={(e) => {
          e.preventDefault();
          submitId(id);
        }}>
        <div>
          <p>Type your id</p>
        </div>
        <div>
          <Input onChange={(e) => setId(e.currentTarget.value)} value={id} />
        </div>
        <div>
          <Button onClick={() => submitId(id)}>enter</Button>
        </div>
      </form>
    </LoginContainer>
  );
};

export default React.memo(Login);

const LoginContainer = styled.div`
    width:100%;
    height: 95vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;

    .inner{
        background:white;
        text-align:center;
        padding:20px;
        border:0.6px solid rgba(0,0,0,0.1);
        box-shadow: 4px 4px 12px rgba(0,0,0,0.15);
        border-radius:6px;
        width:30%;

        p{
            font-weight:600;
            font-size:17px;
        }
        button{
            width:100%;
        }
        div{
            margin:10px 0px;
        }
    }
`;
