import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  faPaperclip,
  faPaperPlane,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";

interface Chat {
  id: string;
  message: string;
  sender: {
    image: string;
    is_kyc_verified: boolean;
    self: boolean;
    user_id: string;
  };
  time: string;
}

interface ChatData {
  chats: Chat[];
  from: string;
  name: string;
  to: string;
}

const ChatPage: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [headerData, setHeaderData] = useState<{
    from: string;
    name: string;
    to: string;
  } | null>(null);
  const [chatData, setChatData] = useState<ChatData>({
    chats: [],
    from: "",
    name: "",
    to: "",
  });

  const [fetchingComplete, setFetchingComplete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // console.log('Fetching chats...');
        const response = await fetch(
          `https://qa.corider.in/assignment/chat?page=${page}`
        );
        const data = await response.json();
        if (data.chats.length > 0) {
          setChatData((prevData) => ({
            chats: [...data.chats, ...prevData.chats],
            from: prevData.from,
            name: prevData.name,
            to: prevData.to,
          }));
          setLoading(false);
          // console.log('Chats fetched successfully');
        } else {
          setFetchingComplete(true);
          setLoading(false);
          // console.log('No more chats');
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
        setLoading(false);
      }
    };

    if (page > 0) {
      fetchChats();
    }
  }, [page]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch(
          `https://qa.corider.in/assignment/chat?page=0`
        );
        const data = await response.json();
        setHeaderData({ from: data.from, name: data.name, to: data.to });
        setChatData({ ...data });
      } catch (error) {
        console.error("Error fetching initial chat data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const loadMoreChats = () => {
    setPage((prevPage) => prevPage + 1);
  };

  if (!headerData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <Container className="d-flex justify-content-between align-items-center py-3">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <FontAwesomeIcon icon={faArrowLeft} className="fs-4" />
            </div>

            <h3 className="m-0">{headerData.name}</h3>
          </div>
          <div>
            <FontAwesomeIcon icon={faEdit} className="fs-4" />
          </div>
        </Container>
        <Container>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <div className="rounded-circle p-1">
                <img
                  src="https://fastly.picsum.photos/id/1072/160/160.jpg?hmac=IDpbpA5neYzFjtkdFmBDKXwgr-907ewXLa9lLk9JuA8"
                  alt="Profile Picture"
                  className="rounded-circle"
                />
              </div>
            </div>
            <div>
              <div>
                From: <strong>{headerData.from}</strong>
              </div>
              <div>
                To: <strong>{headerData.to}</strong>
              </div>
            </div>
          </div>
        </Container>
        <hr />

        <Container
          className="chat-container"
          id="scrollableDiv"
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <InfiniteScroll
            dataLength={chatData.chats.length}
            next={loadMoreChats}
            hasMore={!fetchingComplete}
            style={{ display: "flex", flexDirection: "column-reverse" }}
            inverse={true}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            <div className="text-line-container">
              <hr className="line" />
              {chatData.chats.length > 0 && chatData.chats[0]?.time && (
                <div className="text">{chatData.chats[0].time}</div>
              )}
              <hr className="line" />
            </div>
            {chatData.chats.map((chat: Chat) => (
              <div>
                {chat.sender.self ? (
                  <div className="chat-message-user">
                    <div className="message-content user">
                      <div className="message-user">{chat.message}</div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-message current-user">
                    <div className="profile-pic other-user-profile-pic">
                      <img
                        src={chat.sender.image}
                        alt="Profile Picture"
                        className="rounded-circle-image"
                      />
                      {chat.sender.is_kyc_verified && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="kyc-verified-icon"
                        />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message">{chat.message}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!loading && fetchingComplete && chatData.chats.length === 0 && (
              <div>No more chats</div>
            )}
          </InfiniteScroll>
        </Container>

        <Container>
          <div className="message-input-container">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Your Message"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <span className="input-group-text" id="basic-addon2">
                {" "}
                <FontAwesomeIcon icon={faPaperclip} className="attach-icon" />
              </span>
              <span className="input-group-text" id="basic-addon2">
                {" "}
                <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
              </span>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ChatPage;
