import React from 'react'
import { connect } from 'react-redux'
import { steemOperations, steemSelectors } from '../state/steem'
import { withFormik, Form } from 'formik'
import Yup from 'yup'
import Input from '@atlaskit/input'
import FieldBase from '@atlaskit/field-base'
import MentionIcon from '@atlaskit/icon/glyph/mention'
import CheckIcon from '@atlaskit/icon/glyph/check'

const UserInputForm = ({values, errors, touched, isSubmitting, handleChange, setFieldValue, ...rest}) => (
  <Form>
    <FieldBase
      isLoading={isSubmitting}
      isFitContainerWidthEnabled
      isInvalid={touched.user && errors.user}
      invalidMessage={touched.user && errors.user}
    >
      <MentionIcon primaryColor='gray' />&nbsp;
      <Input isEditing type='text' name='user' placeholder='username …' value={values.user} onChange={handleChange} />&nbsp;
      { rest.usernameStatus === 'VALID' && <CheckIcon primaryColor='gray' /> }
    </FieldBase>
  </Form>
)

const UserInput = withFormik({
  mapPropsToValues (props) {
    return {
      user: props.username || ''
    }
  },
  validationSchema: Yup.object().shape({
    user: Yup.string().strict().lowercase('Only lowercase characters are allowed.').min(3, 'User is at least three characters long.').required('User is required.')
  }),
  handleSubmit (values, {props, setErrors, setSubmitting}) {
    props.usernameSubmitted(values.user)
      .then(() => {
        setSubmitting(false)
      })
      .catch((error) => {
        setErrors({ user: error.message })
        setSubmitting(false)
      })
  }
})(UserInputForm)

// export default UserInput
const mapDispatchToProps = {
  usernameSubmitted: steemOperations.usernameSubmitted
}

const mapStateToProps = (state) => {
  const username = steemSelectors.selectUsername(state)
  const usernameStatus = steemSelectors.selectUsernameStatus(state)

  return { username, usernameStatus }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInput)
