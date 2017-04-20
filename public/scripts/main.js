(function ($) {
  $(document).ready(() => {
    $('.col-sm-11 > a > span').on('click', function () {
      $('input[name="sub_id"]').val(this.id)
      $('#tagModal').modal('show')
    })

    $('#formTags').submit(function (event) {
      event.preventDefault()
      $.ajax({
        url: $('#formTags').attr('action'),
        method: 'POST',
        data: $('#formTags').serialize()
      })
      .done(function (response) {
        $('input[type="text"]').val('')
        $('#tagModal').modal('hide')
        alert(response)
      })
    })
  })
}(window.jQuery))
