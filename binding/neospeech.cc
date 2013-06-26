/*
 * binding/neospeech.cc
 */

#include "neospeech.h"

#include <cstring>
#include <iostream>

#include <node_buffer.h>

// Extracts a C string from a V8 Utf8Value.
const char* ToCString(const v8::String::Utf8Value& value) {
  return *value ? *value : "<string conversion failed>";
}

/**
 * Wrapper Functions
 */

v8::Handle<v8::Value> TTSRequestFile(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestFile_Baton* baton = new TTSRequestFile_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());
    v8::String::Utf8Value szSaveDir(params->Get(v8::String::New("szSaveDir"))->ToString());
    v8::String::Utf8Value szSaveFile(params->Get(v8::String::New("szSaveFile"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->szSaveDir = std::string(ToCString(szSaveDir));
    baton->szSaveFile = std::string(ToCString(szSaveFile));
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
  }

  // Output
  baton->result = TTS_RESULT_SUCCESS;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestFile_Work,
    (uv_after_work_cb)TTSRequestFile_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestFile_Work(uv_work_t* req) {
  TTSRequestFile_Baton* baton = static_cast<TTSRequestFile_Baton*>(req->data);

  baton->result = TTSRequestFile(
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    const_cast<char*>(baton->szSaveDir.c_str()),
    const_cast<char*>(baton->szSaveFile.c_str()),
    baton->nSpeakerID,
    baton->nVoiceFormat
  );
}

void TTSRequestFile_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestFile_Baton* baton = static_cast<TTSRequestFile_Baton*>(req->data);

  v8::Local<v8::Object> result = v8::Object::New();
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->result));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestFileSSML(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestFileSSML_Baton* baton = new TTSRequestFileSSML_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());
    v8::String::Utf8Value szSaveDir(params->Get(v8::String::New("szSaveDir"))->ToString());
    v8::String::Utf8Value szSaveFile(params->Get(v8::String::New("szSaveFile"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->szSaveDir = std::string(ToCString(szSaveDir));
    baton->szSaveFile = std::string(ToCString(szSaveFile));
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
  }

  // Output
  baton->result = TTS_RESULT_SUCCESS;
  baton->nMarkSize = 0;
  baton->pTTSMark = NULL;
  baton->nVoiceLen = 0;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestFileSSML_Work,
    (uv_after_work_cb)TTSRequestFileSSML_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestFileSSML_Work(uv_work_t* req) {
  TTSRequestFileSSML_Baton* baton = static_cast<TTSRequestFileSSML_Baton*>(req->data);

  baton->result = TTSRequestFileSSML(
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    const_cast<char*>(baton->szSaveDir.c_str()),
    const_cast<char*>(baton->szSaveFile.c_str()),
    baton->nSpeakerID,
    baton->nVoiceFormat,
    &(baton->nMarkSize),
    &(baton->pTTSMark),
    &(baton->nVoiceLen)
  );
}

void TTSRequestFileSSML_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestFileSSML_Baton* baton = static_cast<TTSRequestFileSSML_Baton*>(req->data);

  v8::Local<v8::Array> marks = v8::Array::New();
  for (int i = 0; i < baton->nMarkSize; ++i) {
    v8::Local<v8::Object> mark = v8::Object::New();
    mark->Set(v8::String::NewSymbol("name"), v8::String::New(baton->pTTSMark[i].sMarkName));
    mark->Set(v8::String::NewSymbol("streamOffset"), v8::Number::New(baton->pTTSMark[i].nOffsetInStream));
    mark->Set(v8::String::NewSymbol("bufferOffset"), v8::Number::New(baton->pTTSMark[i].nOffsetInBuffer));
    // mark->Set(v8::String::NewSymbol("textPos"), v8::Number::New(baton->pTTSMark[i].nPosInText));
    marks->Set(v8::Number::New(i), mark);
  }

  v8::Local<v8::Object> result = v8::Object::New();
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->result));
  result->Set(v8::String::NewSymbol("marks"), marks);
  result->Set(v8::String::NewSymbol("voiceLen"), v8::Number::New(baton->nVoiceLen));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton->pTTSMark;
  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestFileEx(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestFileEx_Baton* baton = new TTSRequestFileEx_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());
    v8::String::Utf8Value szSaveDir(params->Get(v8::String::New("szSaveDir"))->ToString());
    v8::String::Utf8Value szSaveFile(params->Get(v8::String::New("szSaveFile"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->szSaveDir = std::string(ToCString(szSaveDir));
    baton->szSaveFile = std::string(ToCString(szSaveFile));
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
    baton->nTextFormat = params->Get(v8::String::New("nTextFormat"))->NumberValue();
    baton->nVolume = params->Get(v8::String::New("nVolume"))->NumberValue();
    baton->nSpeed = params->Get(v8::String::New("nSpeed"))->NumberValue();
    baton->nPitch = params->Get(v8::String::New("nPitch"))->NumberValue();
    baton->nDictIndex = params->Get(v8::String::New("nDictIndex"))->NumberValue();
  }

  // Output
  baton->result = TTS_RESULT_SUCCESS;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestFileEx_Work,
    (uv_after_work_cb)TTSRequestFileEx_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestFileEx_Work(uv_work_t* req) {
  TTSRequestFileEx_Baton* baton = static_cast<TTSRequestFileEx_Baton*>(req->data);

  baton->result = TTSRequestFileEx(
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    const_cast<char*>(baton->szSaveDir.c_str()),
    const_cast<char*>(baton->szSaveFile.c_str()),
    baton->nSpeakerID,
    baton->nVoiceFormat,
    baton->nTextFormat,
    baton->nVolume,
    baton->nSpeed,
    baton->nPitch,
    baton->nDictIndex
  );
}

void TTSRequestFileEx_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestFileEx_Baton* baton = static_cast<TTSRequestFileEx_Baton*>(req->data);

  v8::Local<v8::Object> result = v8::Object::New();
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->result));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestBuffer(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestBuffer_Baton* baton = new TTSRequestBuffer_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
    baton->bFirst = params->Get(v8::String::New("bFirst"))->NumberValue();
    baton->bAll = params->Get(v8::String::New("bAll"))->NumberValue();
  }

  // Output
  baton->result = NULL;
  baton->sockfd = (args[0]->IsObject() && params->Get(v8::String::New("sockfd"))->IsNumber() ? params->Get(v8::String::New("sockfd"))->NumberValue() : -1);
  baton->nVoiceLen = 0;
  baton->nReturn = TTS_RESULT_CONTINUE;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestBuffer_Work,
    (uv_after_work_cb)TTSRequestBuffer_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestBuffer_Work(uv_work_t* req) {
  TTSRequestBuffer_Baton* baton = static_cast<TTSRequestBuffer_Baton*>(req->data);

  baton->result = _TTSRequestBuffer(
    &(baton->sockfd),
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    &(baton->nVoiceLen),
    baton->nSpeakerID,
    baton->nVoiceFormat,
    baton->bFirst,
    baton->bAll,
    &(baton->nReturn),
    NULL
  );
}

void TTSRequestBuffer_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestBuffer_Baton* baton = static_cast<TTSRequestBuffer_Baton*>(req->data);

  v8::Local<v8::Object> buffer;
  bool success = ((baton->nReturn == TTS_RESULT_CONTINUE || baton->nReturn == TTS_RESULT_SUCCESS)
                  && baton->result != NULL && baton->nVoiceLen > 0);

  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(baton->nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), baton->result, baton->nVoiceLen);
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      v8::Context::GetCurrent()->Global()->Get(v8::String::New("Buffer"))
    );
    const int constructorArgc = 3;
    v8::Handle<v8::Value> constructorArgv[constructorArgc] = {
      slowBuffer->handle_,
      v8::Integer::New(baton->nVoiceLen),
      v8::Integer::New(0)
    };
    buffer = bufferConstructor->NewInstance(constructorArgc, constructorArgv);
  }

  v8::Local<v8::Object> result = v8::Object::New();
  if (success) {
    result->Set(v8::String::NewSymbol("buffer"), buffer);
  }
  if (baton->nReturn == TTS_RESULT_CONTINUE) {
    result->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(baton->sockfd));
  }
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->nReturn));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton->result;
  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestBufferEx(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestBufferEx_Baton* baton = new TTSRequestBufferEx_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
    baton->nTextFormat = params->Get(v8::String::New("nTextFormat"))->NumberValue();
    baton->nVolume = params->Get(v8::String::New("nVolume"))->NumberValue();
    baton->nSpeed = params->Get(v8::String::New("nSpeed"))->NumberValue();
    baton->nPitch = params->Get(v8::String::New("nPitch"))->NumberValue();
    baton->nDictIndex = params->Get(v8::String::New("nDictIndex"))->NumberValue();
    baton->bFirst = params->Get(v8::String::New("bFirst"))->NumberValue();
    baton->bAll = params->Get(v8::String::New("bAll"))->NumberValue();
  }

  // Output
  baton->result = NULL;
  baton->sockfd = (args[0]->IsObject() && params->Get(v8::String::New("sockfd"))->IsNumber() ? params->Get(v8::String::New("sockfd"))->NumberValue() : -1);
  baton->nVoiceLen = 0;
  baton->nReturn = TTS_RESULT_CONTINUE;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestBufferEx_Work,
    (uv_after_work_cb)TTSRequestBufferEx_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestBufferEx_Work(uv_work_t* req) {
  TTSRequestBufferEx_Baton* baton = static_cast<TTSRequestBufferEx_Baton*>(req->data);

  baton->result = _TTSRequestBufferEx(
    &(baton->sockfd),
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    &(baton->nVoiceLen),
    baton->nSpeakerID,
    baton->nVoiceFormat,
    baton->nTextFormat,
    baton->nVolume,
    baton->nSpeed,
    baton->nPitch,
    baton->nDictIndex,
    baton->bFirst,
    baton->bAll,
    &(baton->nReturn),
    NULL
  );
}

void TTSRequestBufferEx_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestBufferEx_Baton* baton = static_cast<TTSRequestBufferEx_Baton*>(req->data);

  v8::Local<v8::Object> buffer;
  bool success = ((baton->nReturn == TTS_RESULT_CONTINUE || baton->nReturn == TTS_RESULT_SUCCESS)
                  && baton->result != NULL && baton->nVoiceLen > 0);

  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(baton->nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), baton->result, baton->nVoiceLen);
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      v8::Context::GetCurrent()->Global()->Get(v8::String::New("Buffer"))
    );
    const int constructorArgc = 3;
    v8::Handle<v8::Value> constructorArgv[constructorArgc] = {
      slowBuffer->handle_,
      v8::Integer::New(baton->nVoiceLen),
      v8::Integer::New(0)
    };
    buffer = bufferConstructor->NewInstance(constructorArgc, constructorArgv);
  }

  v8::Local<v8::Object> result = v8::Object::New();
  if (success) {
    result->Set(v8::String::NewSymbol("buffer"), buffer);
  }
  if (baton->nReturn == TTS_RESULT_CONTINUE) {
    result->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(baton->sockfd));
  }
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->nReturn));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton->result;
  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestBufferSSMLEx(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestBufferSSMLEx_Baton* baton = new TTSRequestBufferSSMLEx_Baton();
  v8::Handle<v8::Object> params;
  if (args[0]->IsObject()) {
    params = v8::Handle<v8::Object>::Cast(args[0]);
  }

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());
    v8::String::Utf8Value pText(params->Get(v8::String::New("pText"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
    baton->pText = std::string(ToCString(pText));
    baton->nTextLen = params->Get(v8::String::New("nTextLen"))->NumberValue();
    baton->nSpeakerID = params->Get(v8::String::New("nSpeakerID"))->NumberValue();
    baton->nVoiceFormat = params->Get(v8::String::New("nVoiceFormat"))->NumberValue();
    baton->nVolume = params->Get(v8::String::New("nVolume"))->NumberValue();
    baton->nSpeed = params->Get(v8::String::New("nSpeed"))->NumberValue();
    baton->nPitch = params->Get(v8::String::New("nPitch"))->NumberValue();
    baton->nDictIndex = params->Get(v8::String::New("nDictIndex"))->NumberValue();
    baton->bFirst = params->Get(v8::String::New("bFirst"))->NumberValue();
  }

  // Output
  baton->result = NULL;
  baton->sockfd = (args[0]->IsObject() && params->Get(v8::String::New("sockfd"))->IsNumber() ? params->Get(v8::String::New("sockfd"))->NumberValue() : -1);
  baton->nVoiceLen = 0;
  baton->nMarkSize = 0;
  baton->pTTSMark = NULL;
  baton->nReturn = TTS_RESULT_CONTINUE;

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestBufferSSMLEx_Work,
    (uv_after_work_cb)TTSRequestBufferSSMLEx_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestBufferSSMLEx_Work(uv_work_t* req) {
  TTSRequestBufferSSMLEx_Baton* baton = static_cast<TTSRequestBufferSSMLEx_Baton*>(req->data);

  baton->result = _TTSRequestBufferSSMLEx(
    &(baton->sockfd),
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort,
    const_cast<char*>(baton->pText.c_str()),
    baton->nTextLen,
    &(baton->nVoiceLen),
    baton->nSpeakerID,
    baton->nVoiceFormat,
    baton->nVolume,
    baton->nSpeed,
    baton->nPitch,
    baton->nDictIndex,
    &(baton->nMarkSize),
    &(baton->pTTSMark),
    baton->bFirst,
    &(baton->nReturn),
    NULL
  );
}

void TTSRequestBufferSSMLEx_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestBufferSSMLEx_Baton* baton = static_cast<TTSRequestBufferSSMLEx_Baton*>(req->data);

  v8::Local<v8::Object> buffer;
  bool success = ((baton->nReturn == TTS_RESULT_CONTINUE || baton->nReturn == TTS_RESULT_SUCCESS)
                  && baton->result != NULL && baton->nVoiceLen > 0);

  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(baton->nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), baton->result, baton->nVoiceLen);
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      v8::Context::GetCurrent()->Global()->Get(v8::String::New("Buffer"))
    );
    const int constructorArgc = 3;
    v8::Handle<v8::Value> constructorArgv[constructorArgc] = {
      slowBuffer->handle_,
      v8::Integer::New(baton->nVoiceLen),
      v8::Integer::New(0)
    };
    buffer = bufferConstructor->NewInstance(constructorArgc, constructorArgv);
  }

  v8::Local<v8::Array> marks = v8::Array::New();
  for (int i = 0; i < baton->nMarkSize; ++i) {
    v8::Local<v8::Object> mark = v8::Object::New();
    mark->Set(v8::String::NewSymbol("name"), v8::String::New(baton->pTTSMark[i].sMarkName));
    mark->Set(v8::String::NewSymbol("streamOffset"), v8::Number::New(baton->pTTSMark[i].nOffsetInStream));
    mark->Set(v8::String::NewSymbol("bufferOffset"), v8::Number::New(baton->pTTSMark[i].nOffsetInBuffer));
    // mark->Set(v8::String::NewSymbol("textPos"), v8::Number::New(baton->pTTSMark[i].nPosInText));
    marks->Set(v8::Number::New(i), mark);
  }

  v8::Local<v8::Object> result = v8::Object::New();
  if (success) {
    result->Set(v8::String::NewSymbol("buffer"), buffer);
  }
  if (baton->nReturn == TTS_RESULT_CONTINUE) {
    result->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(baton->sockfd));
  }
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->nReturn));
  result->Set(v8::String::NewSymbol("marks"), marks);

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton->result;
  delete baton->pTTSMark;
  delete baton;
  delete req;
}

v8::Handle<v8::Value> TTSRequestStatus(const v8::Arguments& args) {
  v8::HandleScope scope;

  if (args.Length() != 2 || !args[1]->IsObject()) {
    return ThrowException(v8::Exception::TypeError(
      v8::String::New("Second argument must be a callback function.")
    ));
  }

  // Baton
  TTSRequestStatus_Baton* baton = new TTSRequestStatus_Baton();

  // Callback
  baton->callback = v8::Persistent<v8::Function>::New(v8::Local<v8::Function>::Cast(args[1]));

  // Input
  if (args[0]->IsObject()) {
    v8::Handle<v8::Object> params = v8::Handle<v8::Object>::Cast(args[0]);

    v8::String::Utf8Value szServer(params->Get(v8::String::New("szServer"))->ToString());

    baton->szServer = std::string(ToCString(szServer));
    baton->nPort = params->Get(v8::String::New("nPort"))->NumberValue();
  }

  // Request
  uv_work_t* req = new uv_work_t();
  req->data = baton;

  int status = uv_queue_work(
    uv_default_loop(),
    req,
    TTSRequestStatus_Work,
    (uv_after_work_cb)TTSRequestStatus_After
  );

  assert(status == 0);

  return v8::Undefined();
}

void TTSRequestStatus_Work(uv_work_t* req) {
  TTSRequestStatus_Baton* baton = static_cast<TTSRequestStatus_Baton*>(req->data);

  baton->result = TTSRequestStatus(
    const_cast<char*>(baton->szServer.c_str()),
    baton->nPort
  );
}

void TTSRequestStatus_After(uv_work_t* req) {
  v8::HandleScope scope;
  TTSRequestStatus_Baton* baton = static_cast<TTSRequestStatus_Baton*>(req->data);

  v8::Local<v8::Object> result = v8::Object::New();
  result->Set(v8::String::NewSymbol("code"), v8::Number::New(baton->result));

  const unsigned argc = 1;
  v8::Local<v8::Value> argv[argc] = { result };
  baton->callback->Call(v8::Context::GetCurrent()->Global(), argc, argv);

  v8::TryCatch try_catch;
  if (try_catch.HasCaught()) {
    node::FatalException(try_catch);
  }
  baton->callback.Dispose();

  delete baton;
  delete req;
}

/**
 * Initialize
 */
void Initialize(v8::Handle<v8::Object> target) {
  target->Set(v8::String::NewSymbol("TTSRequestFile"),
              v8::FunctionTemplate::New(TTSRequestFile)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestFileSSML"),
              v8::FunctionTemplate::New(TTSRequestFileSSML)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestFileEx"),
              v8::FunctionTemplate::New(TTSRequestFileEx)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestBuffer"),
              v8::FunctionTemplate::New(TTSRequestBuffer)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestBufferEx"),
              v8::FunctionTemplate::New(TTSRequestBufferEx)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestBufferSSMLEx"),
              v8::FunctionTemplate::New(TTSRequestBufferSSMLEx)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestStatus"),
              v8::FunctionTemplate::New(TTSRequestStatus)->GetFunction());
}

NODE_MODULE(neospeech, Initialize)
