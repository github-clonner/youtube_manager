(function ($) {
  $(document).ready(() => {
    $('.col-sm-11 > a > span').on('click', () => {
      var id = $(this).attr('id')

      $('#tagModal').modal('show')
    })
  })
})(window.jQuery)
