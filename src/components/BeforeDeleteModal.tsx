import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Input,
  Link
} from '@nextui-org/react';

type props = {
  isOpen: boolean;
  toggleDeleteModal: () => void;
  onDelete: () => void;
};

function BeforeDeleteModal({ isOpen, toggleDeleteModal, onDelete }: props) {
  return (
    <Modal
      isOpen={isOpen}
      backdrop="blur"
      onOpenChange={toggleDeleteModal}
      placement="top-center"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Warning!</ModalHeader>
            <ModalBody>
              <p>
                This action cannot be undone. <br />
                All values associated with this field will be lost.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={() => onDelete()}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default BeforeDeleteModal;
