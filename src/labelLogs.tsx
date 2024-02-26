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
  useDisclosure,
} from "@chakra-ui/react";
import { LabelingLogType, useLogStore } from "@/store/useLogStore";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { createClient } from "@supabase/supabase-js";
import { useUserStore } from "@/store/useStore";

const supabaseClient = createClient(
  "https://hhvjxvsajsovyzgmfvgd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhodmp4dnNhanNvdnl6Z21mdmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MzU5NzIsImV4cCI6MjAxNzUxMTk3Mn0.PhRzPvkOCflUJ5hCVI4IZPzAXJMXwTZJdSVfPl1Q7Dk"
);

const LabelLogModal = () => {
  const { id } = useUserStore();
  const { labelLogs, setLabelLogs } = useLogStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        ml={5}
        onClick={async () => {
          const { data, error } = await supabaseClient
            .from("labelingControl")
            .select()
            .eq("user_id", id);
          console.log("다시 불러오기");
          if (data) {
            setLabelLogs(data);
          }
          onOpen();
        }}>
        Check my labeling log
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minWidth={1000} maxHeight={800}>
          <ModalHeader>Labeling log</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div
                style={{
                  maxHeight: "600px",
                  overflow: "scroll",
                }}>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>My Labeling histories</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Start labeling</Th>
                        <Th>Finish labeling</Th>
                        <Th isNumeric>Number of labeled data</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {labelLogs
                        ?.sort(
                          (a, b) =>
                            new Date(b.start_at).getTime() -
                            new Date(a.start_at).getTime()
                        )
                        .map((item: LabelingLogType, index: number) => {
                          const date = new Date(item.start_at);
                          let finish_date_string = "";
                          if (!item.finish_at) {
                            finish_date_string = "Current labeling";
                          } else {
                            const fdate = new Date(item.finish_at);
                            finish_date_string = fdate.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              }
                            );
                          }
                          return (
                            <Tr key={index}>
                              <Td>
                                {date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  weekday: "long",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </Td>
                              <Td>{finish_date_string}</Td>
                              <Td isNumeric>{item.label_num}</Td>
                            </Tr>
                          );
                        })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LabelLogModal;
