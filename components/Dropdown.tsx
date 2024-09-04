import { View, Text, Button } from "react-native";
import React from "react";
import * as DropdownMenu from "zeego/dropdown-menu";

const Dropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button title="sas" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Item key="delete">
        <DropdownMenu.ItemTitle>dsd</DropdownMenu.ItemTitle>
      </DropdownMenu.Item>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
