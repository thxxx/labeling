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

type OntologyProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Ontology = ({ isOpen, onClose }: OntologyProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth={600}>
        <ModalHeader>Labeling guide</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <p>
              **목적** Sound generation model을 위해 sound에 알맞은 caption을
              다는 것이 목표 한 줄 요약 : Sound의 Description 적기
            </p>
            <br />
            <p>고려할 사항</p>
            <br />
            <div>
              1. 가능한 Detail한 description을 작성해주세요 <br />
              2. 디테일하게 적기 어려운 단순한 소리라면 짧게 적어도 괜찮 <br />
              3. 한 사운드를 적는데 고민이 2분 이상 지속된다면 간단한 tag만 적고
              넘어가도 괜찮습니다. <br />
              4. 여러가지 사운드가 떠올라서 고르기가 어렵다면 2,3개의 문장을 다
              적어주세요 <br />
              5. 모든 transcription을 정확하게 적을 필요는 없습니다. <br />
              6. 소리에 관해서 추가적으로 작성가능한 태그 정보가 있다면 문장
              뒤에 ,로 구분하여 적어주세요. ex) lofi, high quality, reverb,
              cresendo, ambient, electronic, cozy, lively, jazz, slow tempo,
              fast tempo, urgent situation, energitic, cinematic, scifi, cartoon
              sound, video game sound, Background noise, cute etc. 7. acoustic
              features
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Ontology;
