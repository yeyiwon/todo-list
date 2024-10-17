import { useRouter } from "next/router";
import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";

import { TodoItem } from "@/types";

const TodoDetail = () => {
    const [todo, setTodo] = useState<TodoItem | null>(null);
    const [memo, setMemo] = useState<string>("");
    const [todoName, setTodoName] = useState<string>("");
    const router = useRouter();
    const { itemId } = router.query; 
    const tenantId = 'yeyiwon'; 

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const loadTodo = async () => {
            if (itemId) {
                try {
                    const response = await axios.get<TodoItem>(
                        `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`
                    );
                    setTodo(response.data);  
                    setTodoName(response.data.name);
                    // 메모랑 이미지는 초기엔 없기에 빈 문자열로도 받아서 상태 업데이트 한다는 의미 
                    setMemo(response.data.memo || ""); 
                    setPreviewImage(response.data.imageUrl || null); 
                    
                } catch (error) {
                    console.error(error);
                }
            }
        };
        loadTodo();
    }, [itemId]);

    const InputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMemo(e.target.value);
        e.target.style.height = "auto"; 
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const NameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTodoName(e.target.value);
    };

    const DeleteTodo = async () => {
        if (itemId) {
            try {
                await axios.delete(
                    `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`
                );
                alert("할 일이 삭제되었습니다."); 
                router.push('/'); 
            } catch (error) {
                console.error("할 일 삭제 실패:", error);
            }
        }
    };
    
    const updateTodo = async () => {
        if (itemId) {
            try {
                let uploadedImageUrl = previewImage;
    
                if (imageFile) {
                    uploadedImageUrl = await uploadImage(imageFile);
                }
    
                // 항목 수정 패치 
                await axios.patch(
                    `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`,
                    {
                        name: todoName,
                        memo: memo,
                        imageUrl: uploadedImageUrl,
                        isCompleted: todo?.isCompleted,
                    }
                );
    
                alert("할 일이 수정되었습니다.");
                router.push('/'); 
            } catch (error) {
                console.error("할 일 수정 실패:", error);
            }
        }
    };


    const completeTodo = async () => {
        if (itemId) {
            try {
                // PATCH 요청
                const updatedTodo = await axios.patch(
                    `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${itemId}`,
                    { isCompleted: !todo?.isCompleted }
                );
                setTodo(updatedTodo.data);
            } catch (error) {
                console.error("할 일 완료 상태 업데이트 실패:", error);
            }
        }
    };

    // 이미지 업로드 함수
    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                `https://assignment-todolist-api.vercel.app/api/${tenantId}/images/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.url; 
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            return null;
        }
    };

    const ImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxFileSize = 5 * 1024 * 1024;
            if (file.size > maxFileSize) {
                alert("파일 크기는 5MB 이하여야 합니다.");
                return; 
            }
    
            setImageFile(file); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string); 
            };
            reader.readAsDataURL(file);
        }
    };

    
    return (
        <div className="container">
                <div className={`selectTodo_box ${todo?.isCompleted ? "DetailDone" : ""}`}>
                    <div className="selectTodo">
                    <Image
                        onClick={completeTodo}
                        src={todo?.isCompleted ? "/images/PropertyDone.png" : "/images/PropertyDefault.png"}
                        alt="todoempty"
                        width={32}
                        height={32}
                    />
                        {/* <textarea
                            value={todoName}
                            className="nametextarea"
                            onChange={NameChange}
                            placeholder="할 일 수정"
                        /> */}

                    <input
                        type="text"
                        value={todoName}
                        onChange={NameChange}
                        placeholder="할 일 수정"
                        className="todo_name_input"
                    />
                    {/* <p>{todoName}</p> */}
                    </div>
                </div>
            <div className="TodoDetail">
            {previewImage ? (
                <div className="TodoDetail_imgbox" style={{ backgroundImage: `url(${previewImage})`, backgroundSize: 'cover', backgroundPosition: 'center', border: 'none' }}>
                    <button className="uploadimgbtn editimg" onClick={() => document.getElementById("fileInput")?.click()}>
                        <Image
                            src="/images/edit.png"
                            alt="Edit Image"
                            width={18}
                            height={18}
                        />
                    </button>
                </div>
            ) : (
                <div className="TodoDetail_imgbox">
                    <Image
                        src="/images/img.png"
                        alt="Todo Image"
                        width={64}
                        height={64}
                        className="TodoDetail_img"
                    />
                    <button className="uploadimgbtn newimg" onClick={() => document.getElementById("fileInput")?.click()}>
                        <Image
                            src="/images/plusgray.png"
                            alt="New Image"
                            width={18}
                            height={18}
                        />
                    </button>
                </div>
            )}

            <input
                type="file"
                id="fileInput"
                style={{ display: "none" }}
                onChange={ImageChange}
            />
                <div className="TodoDetail_memobox">
                    <h2> Memo </h2>
                    <div className="memocontainer">
                        <textarea
                            className="memotextarea"
                            value={memo}
                            onChange={InputChange}
                            placeholder="메모를 입력하세요"
                        />
                    </div>
                </div>
            </div>
            <div className="btn_box">
                <button className="edit_btn" onClick={updateTodo} > 
                    <Image
                        src="/images/check.png"
                        alt=""
                        width={16}
                        height={16}
                    />
                    <span>수정완료</span>
                </button>
                <button className="delete_btn" onClick={DeleteTodo}>
                    <Image
                        src="/images/X.png"
                        alt=""
                        width={16}
                        height={16}
                    />
                    <span>삭제하기</span>
                </button>
            </div>
        </div>
    );
    
}

export default TodoDetail;
