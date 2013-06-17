{
  "targets": [
    {
      "target_name": "neospeech",
      "sources": [ "binding/neospeech.cc" ],
      "link_settings": {
        "libraries": [
          "<(module_root_dir)/binding/libttsapi/libttsapi.a",
        ]
      }
    }
  ]
}
