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
import { useUserStore } from "@/store/useStore";
import { useLogStore } from "@/store/useLogStore";

type OntologyProps = {
  isOpen: boolean;
  onClose: () => void;
  finishLabel: () => void;
};

const FinishModal = ({ isOpen, onClose, finishLabel }: OntologyProps) => {
  const { setIsStart } = useUserStore();
  const { logId, logNum, setLogId, setLogNum } = useLogStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth={600}>
        <ModalHeader>Labeling guide</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <div>
              <p>Are you going to finish labeling?</p>
              <br />
              <p>Labeled Num : {logNum}</p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setIsStart(false);
              finishLabel();
              setLogNum(0);
            }}>
            Finish Labeling
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FinishModal;
