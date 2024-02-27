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

const AllFinishedModal = ({ isOpen, onClose }: OntologyProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent minWidth={600}>
        <ModalHeader>Congrats!</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}>
          <iframe
            src="https://giphy.com/embed/l46CpfHcFbmcJproY"
            width="480"
            height="270"
            frameBorder="0"
            className="giphy-embed"
            allowFullScreen></iframe>
          <br />
          <p
            style={{
              fontSize: "1.2em",
              textAlign: "center",
            }}>
            All labelings are done. Please let us know that you are done!
            <br />
            How was your experience?
          </p>
          <br />
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default React.memo(AllFinishedModal);
