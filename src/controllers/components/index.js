import useCarouselCourses from "./carousel-courses";
import useModalContent from "./modal-content";
import useQuiz from "./quiz";

const useComponentsHooks = () => {
    return {
        useCarouselCourses,
        useModalContent,
        useQuiz
    };
}

export default useComponentsHooks;