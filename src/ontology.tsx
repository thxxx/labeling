import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

type OntologyProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Ontology = ({ isOpen, onClose }: OntologyProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth={800}>
        <ModalHeader>Labeling guide</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BodyContianer
            style={{
              lineHeight: "30px",
            }}>
            한 줄 요약 : Sound의 Description 적기
            <br />
            <strong>Goal</strong> : Sound generation model을 위해 sound에 알맞은
            caption을 다는 것
            <br />
            <strong>고려할 사항</strong>
            <br />
            <strong>1.</strong> 가능한 Detail한 description을 작성해주세요
            <br />
            <strong>2.</strong> 디테일하게 적기 어려운 단순한 소리라면 짧게
            적어도 괜찮습니다.
            <br />
            <strong>3.</strong> 한 사운드를 적는데 고민이 2분 이상 지속된다면
            간단한 tag만 적고 넘어가도 괜찮습니다.
            <br />
            <strong>4.</strong> 여러가지 사운드가 떠올라서 하나의 문장을
            선택해서 작성하기가 어렵다면 2,3개의 문장을 전부 적어주세요
            <br />
            <strong>5.</strong> 모든 transcription을 정확하게 적을 필요는
            없습니다.
            <br />
            <strong>6.</strong> 소리에 관해서 추가적으로 작성가능한 태그 정보가
            있다면 문장 뒤에 ,로 구분하여 적어주세요.
            <br />
            <p className="example">
              Examples
              <br />
              <span>quality</span> : lofi, high quality
              <br />
              <span>acoustic features</span> : reverb, cresendo, slow tempo,
              fast tempo, heavy, high pitch, low pitch
              <br />
              <span>mood</span> : cozy, lively, deep, peaceful, dark, eerie,
              chanting
              <br />
              <span>style(like genre of the sound)</span> : scifi, cartoon,
              video game, cute, Background noise, jazz, electronic, magical,
              90’s, 8bit, atari game, hrror movie, casual game
            </p>
            <strong>7.</strong> description에 포함되는 주요 명사에는 가능한 앞에
            형용사를 함께 적어주세요.
            <br />
            <p className="example">ex) dog → angry dog, sword → long sword</p>
            <strong>8.</strong> 어떠한 상황에서 발생한/어떠한 상황에서 쓰이면
            좋은 소리인지를 `context`에 작성해주세요
            <br />
            <p className="example">
              ex : 1) running away from something in horror movie. 2) when robot
              saw something new. 3) a dog found another dog in distance
            </p>
          </BodyContianer>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(Ontology);

const BodyContianer = styled.div`
  line-height:32px;

  .example{
    margin:4px 0px;
    margin-left:20px;
    line-height:25px;
    span{
      background-color:rgba(0,0,0,0.08);
      border-radius:2px;
      padding:1px 4px;
    }
  }
`;
