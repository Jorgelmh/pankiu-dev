import {
  AppBarSection,
  AppBarSpacer,
  Avatar,
} from "@progress/kendo-react-layout";

import Logo from "components/atoms/svg/logo";

import { StyledAppBar } from "./styles";

let kendokaAvatar =
  "https://www.telerik.com/kendo-react-ui-develop/images/kendoka-react.png";

const TopBar: React.FC = ({ children }) => {
  return (
    <>
      <StyledAppBar>
        <AppBarSection>
          <button className="k-button k-button-clear">
            <Logo />
          </button>
        </AppBarSection>

        <AppBarSpacer style={{ width: 4 }} />

        <AppBarSection>
          <h1 className="title">Name</h1>
        </AppBarSection>

        <AppBarSpacer style={{ width: 32 }} />

        <AppBarSpacer />

        <AppBarSection>
          <Avatar shape="circle" type="image">
            <img src={kendokaAvatar} />
          </Avatar>
        </AppBarSection>
      </StyledAppBar>
    </>
  );
};

export default TopBar;
