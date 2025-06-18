import React from 'react'
import PropTypes from 'prop-types'
/** Components */
import { CardStyle } from 'screens/Cursos/ModalContent.styles'
import useQuizComponents from './components'
/** Styles */
import './QuizComponent.css'
import useControllers from 'controllers'

const QuizComponent = (props) => {
	/** Props */
	const { data, content, id, onClose, module, course } = props

	/** Components */
	const { CompleteQuiz, Question, Options } = useQuizComponents()

	/** Controllers */
	const { useComponentsHooks } = useControllers()
	const { useQuiz } = useComponentsHooks()
	const {
		options,
		responses,
		question,
		messageButton,
		handleSelectedOption,
		handleSentQuiz,
		user_progress
	} = useQuiz(props)


	return (
		<React.Suspense>
			{data.questions && (
				<CardStyle>
					<div className="card-entry">
						{(data.complete_quizzes) && <CompleteQuiz data={data}/>}

						<div className="card-left">
							<Question
								question={
									data.questions[question].question ?? ''
								}
								image={data.questions[question].image ?? ''}
							/>
						</div>
						<div className="card-right">
							<Options
								multiple={data.questions[question].multiple}
								options={options}
								responses={responses[question] ?? ''}
								onSelectedOption={handleSelectedOption}
								button_message={messageButton}
								onSentQuiz={handleSentQuiz}
							/>
						</div>
					</div>
				</CardStyle>
			)}
		</React.Suspense>
	)
}

QuizComponent.propTypes = {
	data: PropTypes.array.isRequired,
	content: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	module: PropTypes.number.isRequired,
	course: PropTypes.number.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default QuizComponent
