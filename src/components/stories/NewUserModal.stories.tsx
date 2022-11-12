// Button.stories.ts|tsx

import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";

import NewUserModal from "../NewUserModal";
import { NewUserFormT } from "../../types";

export default {
  title: "New user modal form",
  component: NewUserModal,
} as ComponentMeta<typeof NewUserModal>;

//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof NewUserModal> = (args: {
  newUserForm: NewUserFormT;
  setNewUserForm: React.Dispatch<React.SetStateAction<NewUserFormT>>;
  handleClose: () => void;
  handleSubmit: () => void;
  isOpen: boolean;
}) => <NewUserModal {...args} />;

export const Empty = Template.bind({});
export const PreFilled = Template.bind({});

Empty.args = {
  newUserForm: {
    firstName: "",
    lastName: "",
    dateOfBirth: new Date(),
    isAdmin: false,
  },
  isOpen: true,
  setNewUserForm: () => {},
  handleClose: () => {},
  handleSubmit: () => {},
};

PreFilled.args = {
  newUserForm: {
    firstName: "Adam",
    lastName: "Sandler",
    dateOfBirth: new Date("9/9/1966"),
    isAdmin: true,
  },
  isOpen: true,
  setNewUserForm: () => {},
  handleClose: () => {},
  handleSubmit: () => {},
};
