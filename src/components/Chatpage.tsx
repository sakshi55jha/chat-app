import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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
        <Container className="div-1 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="arr-ico me-3">
              <FontAwesomeIcon icon={faArrowLeft} className="fs-4" />
            </div>

            <h3 className=" head-data">{headerData.name}</h3>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <g clip-path="url(#clip0_1_889)">
                <path
                  d="M9.16666 3.33332H5.66666C4.26653 3.33332 3.56647 3.33332 3.03169 3.6058C2.56128 3.84549 2.17883 4.22794 1.93915 4.69834C1.66666 5.23312 1.66666 5.93319 1.66666 7.33332V14.3333C1.66666 15.7335 1.66666 16.4335 1.93915 16.9683C2.17883 17.4387 2.56128 17.8212 3.03169 18.0608C3.56647 18.3333 4.26653 18.3333 5.66666 18.3333H12.6667C14.0668 18.3333 14.7669 18.3333 15.3016 18.0608C15.772 17.8212 16.1545 17.4387 16.3942 16.9683C16.6667 16.4335 16.6667 15.7335 16.6667 14.3333V10.8333M6.66664 13.3333H8.06209C8.46975 13.3333 8.67357 13.3333 8.86538 13.2873C9.03544 13.2464 9.19802 13.1791 9.34714 13.0877C9.51533 12.9847 9.65946 12.8405 9.94771 12.5523L17.9167 4.58332C18.607 3.89296 18.607 2.77368 17.9167 2.08332C17.2263 1.39296 16.107 1.39296 15.4167 2.08332L7.44769 10.0523C7.15944 10.3405 7.01531 10.4847 6.91224 10.6528C6.82086 10.802 6.75352 10.9645 6.71269 11.1346C6.66664 11.3264 6.66664 11.5302 6.66664 11.9379V13.3333Z"
                  stroke="#141E0D"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1_889">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </Container>
        <Container>
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <div className="rounded-circle p-1">
                <img
                  src="https://fastly.picsum.photos/id/1072/160/160.jpg?hmac=IDpbpA5neYzFjtkdFmBDKXwgr-907ewXLa9lLk9JuA8"
                  alt="Profile"
                  className="rounded-circle"
                />
              </div>
            </div>
            <div className="tag-data">
              <div>
                <span className="text-span"> From </span>
                <strong className="text-s">{headerData.from}</strong>
              </div>
              <div>
                <span className="text-span"> To </span>
                <strong className="text-s">{headerData.to}</strong>
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
            style={{
              display: "flex",
              flexDirection: "column-reverse",
              overflow: "hidden ",
            }}
            inverse={true}
            loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            <div className="text-line-container">
              <hr className="line" />
              {chatData.chats.length > 0 && chatData.chats[0]?.time && (
                <div className="text-time">{chatData.chats[0].time}</div>
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
                      {chat.sender.is_kyc_verified && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="kyc-verified-icon"
                          width="8"
                          height="8"
                          viewBox="0 0 8 8"
                          fill="none"
                        >
                          <rect
                            x="2.90874"
                            y="2.90872"
                            width="3.18182"
                            height="2.54545"
                            fill="white"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.00966 4.18146C1.00957 4.13888 1.0012 4.09634 0.984573 4.05626L0.755025 3.50047C0.706529 3.38342 0.681478 3.25777 0.681458 3.13107C0.681437 3.0043 0.706395 2.87877 0.754906 2.76165C0.803417 2.64453 0.87453 2.53812 0.964182 2.44849C1.05381 2.35889 1.16021 2.28782 1.27731 2.23935L1.83219 2.0095C1.91255 1.97627 1.97665 1.91246 2.0101 1.83219L2.24001 1.27714C2.33794 1.0407 2.52578 0.852849 2.76222 0.754911C2.99865 0.656973 3.26431 0.656973 3.50074 0.754911L4.05537 0.984654C4.13585 1.01788 4.22633 1.01784 4.30675 0.984465L4.30738 0.984204L4.8625 0.755249C5.09885 0.657444 5.36456 0.657412 5.60089 0.755305C5.83728 0.853224 6.0251 1.04102 6.12304 1.2774L6.34743 1.81912C6.34942 1.8234 6.35133 1.82774 6.35315 1.83213C6.38641 1.91258 6.45023 1.97653 6.53059 2.00996L7.0858 2.23994C7.32223 2.33788 7.51008 2.52573 7.60801 2.76217C7.70594 2.99861 7.70594 3.26426 7.60801 3.5007L7.37817 4.05561C7.36147 4.09591 7.35313 4.13885 7.35313 4.18155C7.35313 4.22426 7.36147 4.267 7.37817 4.30731L7.60801 4.86221C7.70594 5.09865 7.70594 5.36431 7.60801 5.60074C7.51008 5.83718 7.32223 6.02503 7.0858 6.12297L6.53059 6.35295C6.45023 6.38638 6.38641 6.45033 6.35315 6.53078C6.35133 6.53518 6.34942 6.53952 6.34743 6.54379L6.12304 7.08552C6.0251 7.32189 5.83728 7.50969 5.60089 7.60761C5.36456 7.7055 5.09885 7.70547 4.8625 7.60767L4.30738 7.37871L4.30675 7.37845C4.22633 7.34508 4.13585 7.34503 4.05537 7.37826L3.50074 7.608C3.26431 7.70594 2.99865 7.70594 2.76222 7.608C2.52578 7.51007 2.33794 7.32221 2.24001 7.08578L2.0101 6.53072C1.97665 6.45045 1.91255 6.38665 1.83219 6.35342L1.27731 6.12357C1.16021 6.07509 1.05381 6.00402 0.964182 5.91442C0.87453 5.82479 0.803417 5.71838 0.754906 5.60126C0.706395 5.48414 0.681437 5.35861 0.681458 5.23184C0.681478 5.10514 0.706529 4.9795 0.755025 4.86245L0.984573 4.30665C1.0012 4.26657 1.00957 4.22404 1.00966 4.18146ZM5.52008 3.61099C5.64434 3.48673 5.64434 3.28527 5.52008 3.16101C5.39582 3.03676 5.19436 3.03676 5.07011 3.16101L3.86328 4.36784L3.4519 3.95647C3.32764 3.83221 3.12618 3.83221 3.00192 3.95647C2.87767 4.08073 2.87767 4.28219 3.00192 4.40645L3.63829 5.04281C3.76254 5.16707 3.96401 5.16707 4.08826 5.04281L5.52008 3.61099Z"
                            fill="#1C63D5"
                          />
                        </svg>
                      )}
                      <img
                        src={chat.sender.image}
                        alt="Profile"
                        className="rounded-circle-image"
                      />
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

        <div className="message-input-container">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Reply to @Rohit Yadav"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <span className="input-group-text" id="basic-addon2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.6271 9.08291L10.1141 16.5959C8.40554 18.3045 5.63544 18.3045 3.9269 16.5959C2.21835 14.8874 2.21835 12.1173 3.9269 10.4087L11.4399 2.89573C12.5789 1.7567 14.4257 1.7567 15.5647 2.89573C16.7037 4.03476 16.7037 5.88149 15.5647 7.02052L8.34631 14.2389C7.7768 14.8084 6.85343 14.8084 6.28392 14.2389C5.7144 13.6694 5.7144 12.746 6.28392 12.1765L12.6184 5.84201"
                  stroke="#141E0D"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="input-group-text" id="basic-addon2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="send-03">
                  <path
                    id="Icon"
                    d="M8.75036 10H4.16702M4.09648 10.2429L2.15071 16.0552C1.99785 16.5118 1.92142 16.7401 1.97627 16.8807C2.0239 17.0028 2.1262 17.0954 2.25244 17.1306C2.3978 17.1712 2.61736 17.0724 3.05647 16.8748L16.9827 10.608C17.4113 10.4151 17.6256 10.3187 17.6918 10.1847C17.7494 10.0683 17.7494 9.93174 17.6918 9.81535C17.6256 9.68139 17.4113 9.58495 16.9827 9.39208L3.05161 3.12313C2.61383 2.92612 2.39493 2.82762 2.24971 2.86803C2.1236 2.90312 2.0213 2.99544 1.97351 3.11731C1.91847 3.25764 1.99408 3.48545 2.14531 3.94108L4.09702 9.8213C4.12299 9.89955 4.13598 9.93868 4.14111 9.9787C4.14565 10.0142 4.14561 10.0502 4.14097 10.0857C4.13574 10.1257 4.12265 10.1648 4.09648 10.2429Z"
                    stroke="#141E0D"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
