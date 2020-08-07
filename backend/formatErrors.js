import _ from 'lodash'

const formatErrors = (e) => {
    if (e.name === 'SequelizeValidationError') {
      return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    if (e.name === 'SequelizeUniqueConstraintError') {
      return [{ path: 'name', message: 'Value must be unique' }];
    }
    

    return [{ path: 'name', message: 'something went wrong' }];
};

export default formatErrors;