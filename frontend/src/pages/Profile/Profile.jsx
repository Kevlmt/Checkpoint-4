/* eslint-disable import/no-unresolved */
// /* eslint-disable import/no-unresolved */
// // eslint-disable-next-line import/order
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "@components/Header";
import PopupProfil from "@pages/Profile/Components/PopupProfil";
import axios from "@services/axios";
import AsideProfile from "./Components/AsideProfile";
// import UserContext from "../../contexts/UserContext";
import "./Profile.scss";
import ContentProfile from "./Components/ContentProfile";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const query = useQuery();
  const { userId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const [usersList, setUsersList] = useState(null);
  const fetchUsersList = async () => {
    try {
      const fetchedData = await axios
        .get("/users", { withCredentials: true })
        .then((response) => response.data);
      if (fetchedData) {
        return setUsersList(fetchedData);
      }
      return null;
    } catch (err) {
      return alert(err.reponse.data);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const dataFetched = await axios
        .get(`/users/${userId}`, { withCredentials: true })
        .then((result) => result.data);
      if (dataFetched) {
        return setUserInfo(dataFetched);
      }
      return null;
    } catch (err) {
      return alert(err.response.data);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [userId]);

  return (
    <div className="page-profile">
      {query.get("editProfil") === "open" && (
        <PopupProfil
          fetchUserInfo={fetchUserInfo}
          query={query}
          userInfo={userInfo}
          userId={userId}
        />
      )}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="profile-container">
        <AsideProfile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          usersList={usersList}
          userId={parseInt(userId, 10)}
        />
        <ContentProfile
          query={query}
          userInfo={userInfo}
          userId={parseInt(userId, 10)}
        />
      </div>
    </div>
  );
}
