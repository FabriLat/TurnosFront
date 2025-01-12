import { Button, ListGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'

const EachUser = ({ id, name, email, onDelete }) => {
  return (
        <ListGroup.Item style={{backgroundColor: '#b0b5d6'}} className="d-flex align-items-center justify-content-between">
            {name}<br/> {email}
            <Button variant='danger' onClick={() => onDelete(id)} >Borrado Permanente</Button>
        </ListGroup.Item>
    )
}

EachUser.propType = {
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,

    onDelete: PropTypes.func
}

export default EachUser
