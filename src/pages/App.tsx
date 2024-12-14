import { Container } from "@mantine/core";
import { Header } from "./components/Header";
import { GameModal } from "./components/games/GameModal";
import { AddMadamisButton } from "./components/madamis/AddMadamisButton";
import { MadamisList } from "./components/madamis/MadamisList";
import { MadamisModal } from "./components/madamis/MadamisModal";

export const App = () => {
  return (
    <>
      <Header />
      <AddMadamisButton />
      <Container size="100%">
        <MadamisList />
      </Container>
      <MadamisModal />
      <GameModal />
    </>
  );
};
