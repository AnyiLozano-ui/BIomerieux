import useApi from "api";
import useModels from "models";
import React from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const useCourse = () => {
    /** Variables */
    const { slug } = useParams();

    /** Api */
    const { useActions } = useApi();
    const { dispatch, useCoursesActions } = useActions();
    const { actGetCourse, actAddCourse, actCommentCourse } = useCoursesActions();

    /** Models */
    const { useSelectors } = useModels();
    const { useSelector, useAuthSelectors, useCoursesSelectors } = useSelectors();
    const { courseSelector } = useCoursesSelectors();
    const { loginSelector } = useAuthSelectors();
    const course = useSelector(courseSelector);
    const { login } = useSelector(loginSelector);

    /** States */
    const [width, setWidth] = React.useState(window.innerWidth);
    const [comment, setComment] = React.useState("");
    const [stars, setStars] = React.useState(0);
    const [openModal, setOpenModal] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState({});
    const [loading, setLoading] = React.useState({});

    const addCourse = (course, user) => {
        dispatch(actAddCourse({
            data: { course, user },
            onError: (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrio un problema al momento de adquirir el curso"
                });

                console.error("ADD_COURSE: ", error);
            },
            onSuccess: () => {
                dispatch(actGetCourse({
                    slug,
                    id: login.user.id,
                    onError: (error) => console.error("GET_COURSE: ", error)
                }));
            }
        }));

    };

    const addComment = () => {
        dispatch(actCommentCourse({
            data: { course: course.id, user: login.user.id, comment, stars },
            onError: (error) => {
                Swal.fire({
                    icon: "error",
                    title: "Ocurrio un problema al momento de guardar tu comentario"
                });

                console.error("ADD_COMMENT: ", error);
            },
            onSuccess: () => {
                setComment(undefined);
                setStars(0);
                dispatch(actGetCourse({
                    slug,
                    id: login.user.id,
                    onError: (error) => console.error("GET_COURSE: ", error)
                }));
            }
        }));
    };

    const changeComment = (e) => {
        setComment(e.target.value);
    };

    const changeStars = (quantity) => {
        setStars(quantity);

        const starsSelector = document.querySelectorAll(".star");

        for (let i = 0; i < starsSelector.length; i++) {
            if (i < quantity) {
                starsSelector[i].style.opacity = "1";
            } else {
                starsSelector[i].style.opacity = "0.5";
            }
        }
    };

    const overStar = (type, quantity) => {
        if (type === "over") {
            const starsSelector = document.querySelectorAll(".star");

            if(stars === 0) {
                for (let i = 0; i < starsSelector.length; i++) {
                    if (i < quantity) {
                        starsSelector[i].style.opacity = "1";
                    } else {
                        starsSelector[i].style.opacity = "0.5";
                    }
                }
            }
        } else {
            const starsSelector = document.querySelectorAll(".star");

            if(stars === 0) {
                for (let i = 0; i < starsSelector.length; i++) {
                    starsSelector[i].style.opacity = "0.5";
                }
            }
        }

    };

    const handleOpenModalModule = (content, key, item) => {
        if (key === 0) {
			setOpenModal(true)
			setSelectedItem({
				...content,
				moduleSelected: item.name.split(' ')[1],
			})
		} else {
            const data = JSON.parse(localStorage.getItem('course'))
			const lastModule = data.modules.find(
				(_item, index) => index === key - 1
			)
			const getQuiz =
				lastModule.module_contents[
					lastModule.module_contents.length - 1
				]
			const isComplete = getQuiz.complete_quizzes

            console.log(isComplete)

			if (data.have_course && isComplete || lastModule.module_contents.length < 2) {
				setOpenModal(true)
				setSelectedItem({
					...content,
					moduleSelected: item.name.split(' ')[1],
				})
			}
		}
    }

    React.useEffect(() => {
        setLoading(true)
        dispatch(actGetCourse({
            slug,
            id: login.user.id,
            onError: (error) => console.error("GET_COURSE: ", error)
        }));
        setTimeout(() => {
            setLoading(false)
        }, 1500)
        window.addEventListener("resize", () => setWidth(window.innerWidth));
    }, [slug,login.user.id]);

    return {
        course,
        width,
        user: login.user,
        comment,
        addCourse,
        addComment,
        changeComment,
        changeStars,
        overStar,
        handleOpenModalModule,
        openModal,
        setOpenModal,
        selectedItem,
        setSelectedItem,
        loading
    };
}

export default useCourse;