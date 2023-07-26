export const paginate = (array, pageSize, pageNumber) =>
  array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)

export default paginate
