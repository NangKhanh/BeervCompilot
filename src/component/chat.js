import { useEffect, useRef, useState } from "react"
import axios from "axios";

const Chat = () => {
    const [list, setlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const chatHistoryRef = useRef(null);


    useEffect(() => {
        const storedList = localStorage.getItem("list");
        if (storedList) {
            setlist(JSON.parse(storedList));
            console.log(list);
        }
    }, [])

    useEffect(() => {
        if (list.length !== 0) {
            localStorage.setItem("list", JSON.stringify(list))
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [list])
    const handleMessageSend = async () => {
        if (message !== "") {
            setIsLoading(true)
            try {
                const response = await axios.post('http://127.0.0.1:5000/', {
                    my_question: message
                });
                setlist(prevState => [
                    ...prevState,
                    {
                        my_question: message,
                        answer: response.data.answer
                    }
                ]);
                setMessage("")
                setIsLoading(false)

            } catch (error) {
                setIsLoading(false)
                console.error("Error:", error);
                chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
            }
        }

    };
    return (
        <>
            <div className="container body">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card chat-app">
                            <div className="chat">
                                <div className="chat-header clearfix">
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                <img src="https://res.cloudinary.com/dqsjc7ny3/image/upload/v1715582737/lab4/Gemini_Generated_Image_zdb2uzzdb2uzzdb2_qkhywq.jpg" alt="avatar" />
                                            </a>
                                            <div className="chat-about">
                                                <h6 className="m-b-0">Copilot</h6>
                                                <small>Last seen: 2 hours ago</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chat-history" ref={chatHistoryRef}>
                                    <ul className="m-b-0">
                                        {list?.map((item) => (
                                            <>
                                                <li className="clearfix">
                                                    <div className="message other-message float-right"> {item?.my_question} </div>
                                                </li>
                                                <li className="clearfix">
                                                    <div className="message-data">
                                                        <img src="https://res.cloudinary.com/dqsjc7ny3/image/upload/v1715582737/lab4/Gemini_Generated_Image_zdb2uzzdb2uzzdb2_qkhywq.jpg" alt="avatar" />
                                                    </div>
                                                    <div className="message my-message">{item?.answer}</div>
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                </div>
                                <div className="chat-message clearfix ">
                                    <form className="input-group mb-0 " onSubmit={handleMessageSend}>
                                        <input
                                            type="text"
                                            className="form-control "
                                            placeholder="Enter text here..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <button className="btn btn-primary " type="submit" onClick={handleMessageSend} disabled={isLoading}>
                                            {isLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                "Send"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Chat