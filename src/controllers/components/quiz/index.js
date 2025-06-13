import useApi from 'api'
import React, { useState } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const useQuiz = ({ data, content, id, module, course }) => {
	/** Api */
	const { useActions } = useApi()
	const { dispatch, useCoursesActions } = useActions()
	const { actSendQuiz, actGetCourse } = useCoursesActions()

	/** Variables */
	const { slug } = useParams()

	/** States */
	const [question, setQuestion] = React.useState(0)
	const [options, setOptions] = React.useState([])
	const [responses, setResponses] = React.useState([])
	const [messageButton, setMessageButton] = React.useState('Siguiente')
	const [quizSettings, setQuizSettings] = React.useState({})
	const [user_progress, setUserProgress] = useState({})

	const handleGetOptions = (questionToFilter) => {
		const options = ['a', 'b', 'c', 'd', 'e', 'f']
		const result = options.map((option) => ({
			option:
				questionToFilter[option] === ''
					? null
					: questionToFilter[option],
			response: option,
		}))
		const filterResult = result.filter((option) => option.option !== null)
		setOptions(filterResult)
	}

	const multipleResponseLogic = (option) => {
		if (responses[question] && typeof responses[question] === 'string') {
			const str = responses[question]
			const arrStr = str.split(',')
			if (arrStr.includes(option)) {
				const res = arrStr.filter((pot) => pot !== option)
				setResponses((prevResponses) => {
					prevResponses[question] = res.join(',')
					return [...prevResponses]
				})
			} else {
				arrStr.push(option)
				setResponses((prevResponses) => {
					prevResponses[question] = arrStr.join(',')
					return [...prevResponses]
				})
			}
		} else {
			const arr = [...responses]
			arr.push(option)
			setResponses([...arr])
		}
	}

	const singleResponseLogic = (option) => {
		if (responses[question] && typeof responses[question] === 'string') {
			setResponses((prevRes) => {
				prevRes[question] = option
				return [...prevRes]
			})
		} else {
			const arr = [...responses]
			arr.push(option)
			setResponses([...arr])
		}
	}

	const handleSelectedOption = (option) => {
		if (data.questions[question].multiple) multipleResponseLogic(option)
		else singleResponseLogic(option)
	}

	const handleGetCalification = () => {
		const { correctResponses, isRequired } = quizSettings

		const respon = responses.filter((item, index) => {
			if (isRequired[index]) {
				if (
					item.split(',').sort().join(',') ===
					correctResponses[index].split(',').join(',')
				)
					return item
			} else {
				return item[0] === correctResponses[index][0]
			}
		}).length

		return respon
	}

	const handleSentQuiz = () => {
		if (quizSettings.totalQuestions > question)
			setQuestion((prevState) => prevState + 1)

		const result = quizSettings.percentByQuestion * handleGetCalification()

		if (quizSettings.totalQuestions === question && result < 80) {
			Swal.fire({
				icon: 'error',
				text: 'Revisa tus respuestas y vuelve a enviar el examen.',
			})

			setQuestion(0)
			setResponses([])
			const data_to_root = JSON.parse(
				localStorage.getItem('persist:root')
			)
			const login = JSON.parse(data_to_root.login).login
			const user = login.user.id

			console.log(user_progress)

			const body = {
				quiz_id: data.id,
				user_id: user,
				lives: user_progress ? user_progress.lives - 1 : 0,
				block: user_progress
					? user_progress.lives - 1 === 0
						? new Date()
						: null
					: null,
			}
			axios.post('/update-progresses', body).then((response) => {
				setUserProgress(response.data.data)
			})
		}
		if (quizSettings.totalQuestions === question && result > 79) {
			dispatch(
				actSendQuiz({
					data: {
						calification: result,
						content,
						user: id,
						module,
						course,
					},
					onError: () =>
						Swal.fire({
							icon: 'error',
							title: 'Ocurrio un problema!',
							text: 'Ocurrio un problema al momento de guardar tu examen, vuelve a intentarlo.',
						}),
					onSuccess: () => {
						Swal.fire({
							icon: 'success',
							title: 'Bien Hecho!',
							text: `Pasaste este examen!. tu nota fue de ${result}%`,
							allowOutsideClick: () => {
								const popup = Swal.getPopup()
								popup.classList.remove('swal2-show')
								setTimeout(() => {
									popup.classList.add(
										'animate__animated',
										'animate__headShake'
									)
								})
								setTimeout(() => {
									popup.classList.remove(
										'animate__animated',
										'animate__headShake'
									)
								}, 500)
								return false
							},
						}).then((res) => {
							res.isConfirmed && window.location.reload()
						})
					},
				})
			)
		}
	}

	const handleGetQuizSettings = (data) => {
		let settings = {}
		const correctResponses = data.questions.map((item) => item.correct)
		const totalQuestions = data.questions.length - 1
		const percentByQuestion = 100 / data.questions.length
		const isRequired = data.questions.map((item) => item.multiple)
		settings = {
			...settings,
			correctResponses,
			totalQuestions,
			percentByQuestion,
			isRequired,
		}
		setQuizSettings(settings)
	}

	React.useEffect(() => {
		if (data.questions) {
			handleGetOptions(data.questions[question])
			handleGetQuizSettings(data)
		}
	}, [data])

	React.useEffect(() => {
		if (data.questions) {
			handleGetOptions(data.questions[question])
			if (quizSettings.totalQuestions === question)
				setMessageButton('Enviar')
			else setMessageButton('Siguiente')
		}
	}, [question, data])

	React.useEffect(() => {
		if (!data.user_progress) {
			if (data.id) {
				const data_to_root = JSON.parse(
					localStorage.getItem('persist:root')
				)
				const login = JSON.parse(data_to_root.login).login
				const user = login.user.id

				const body = {
					quiz_id: data.id,
					user_id: user,
				}

				axios.post('/set-progresses', body).then((response) => {
					dispatch(
						actGetCourse({
							slug,
							id: login.user.id,
							onError: (error) =>
								console.error('GET_COURSE: ', error),
						})
					)
				})
			}
		} else if (
			new Date(data.user_progress.block).getHours + 4 <=
			new Date().getHours()
		) {
			const data_to_root = JSON.parse(
				localStorage.getItem('persist:root')
			)
			const login = JSON.parse(data_to_root.login).login
			const user = login.user.id

			const body = {
				quiz_id: data.id,
				user_id: user,
				lives: data.user_progress.lives - 1,
				block: data.user_progress.lives - 1 === 0 ? new Date() : null,
			}
			axios.post('/update-progresses', body).then((response) => {
				setUserProgress(response.data.data)
			})
		}
	}, [data])

	React.useEffect(() => {
		const data_to_root = JSON.parse(
			localStorage.getItem('persist:root')
		)
		const login = JSON.parse(data_to_root.login).login
		const user = login.user.id

		const body = {
			quiz_id: data.id,
			user_id: user,
		}
		axios.post('/get-progresses', body).then((response) => {
			setUserProgress(response.data.data)
		})
	}, [])

	return {
		options,
		responses,
		messageButton,
		question,
		user_progress,
		handleSelectedOption,
		handleSentQuiz,
	}
}

export default useQuiz
