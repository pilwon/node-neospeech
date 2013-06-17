/*
 * binding/neospeech.cc
 */

#include <cstring>
#include <iostream>

#include <node.h>
#include <node_buffer.h>
#include <v8.h>

#include "libttsapi/libttsapi.h"

// Extracts a C string from a V8 Utf8Value.
const char* ToCString(const v8::String::Utf8Value& value) {
  return *value ? *value : "<string conversion failed>";
}

/**
 * Wrapper Functions
 */

v8::Handle<v8::Value> TTSRequestFile(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);
  v8::String::Utf8Value arg4(args[4]);
  v8::String::Utf8Value arg5(args[5]);

  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  char* szSaveDir = const_cast<char*>(ToCString(arg4));
  char* szSaveFile = const_cast<char*>(ToCString(arg5));
  int nSpeakerID = args[6]->NumberValue();
  int nVoiceFormat = args[7]->NumberValue();

  int result = TTSRequestFile(szServer, nPort, pText, nTextLen, szSaveDir,
                              szSaveFile, nSpeakerID, nVoiceFormat);

  v8::HandleScope scope;
  return scope.Close(v8::Number::New(result));
}

v8::Handle<v8::Value> TTSRequestFileSSML(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);
  v8::String::Utf8Value arg4(args[4]);
  v8::String::Utf8Value arg5(args[5]);

  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  char* szSaveDir = const_cast<char*>(ToCString(arg4));
  char* szSaveFile = const_cast<char*>(ToCString(arg5));
  int nSpeakerID = args[6]->NumberValue();
  int nVoiceFormat = args[7]->NumberValue();
  int nMarkSize = 0;
  TTSMARK* pTTSMark = NULL;
  int nVoiceLen = 0;

  int result = TTSRequestFileSSML(szServer, nPort, pText, nTextLen, szSaveDir,
                                  szSaveFile, nSpeakerID, nVoiceFormat,
                                  &nMarkSize, &pTTSMark, &nVoiceLen);

  v8::Local<v8::Array> marksArray = v8::Array::New();
  for (int i = 0; i < nMarkSize; ++i) {
    v8::Local<v8::Object> markObj = v8::Object::New();
    markObj->Set(v8::String::NewSymbol("name"), v8::String::New(pTTSMark[i].sMarkName));
    markObj->Set(v8::String::NewSymbol("streamOffset"), v8::Number::New(pTTSMark[i].nOffsetInStream));
    markObj->Set(v8::String::NewSymbol("bufferOffset"), v8::Number::New(pTTSMark[i].nOffsetInBuffer));
    // markObj->Set(v8::String::NewSymbol("textPos"), v8::Number::New(pTTSMark[i].nPosInText));
    marksArray->Set(v8::Number::New(i), markObj);
  }

  v8::Local<v8::Object> returnObj = v8::Object::New();
  returnObj->Set(v8::String::NewSymbol("code"), v8::Number::New(result));
  returnObj->Set(v8::String::NewSymbol("marks"), marksArray);
  returnObj->Set(v8::String::NewSymbol("voiceLen"), v8::Number::New(nVoiceLen));

  v8::HandleScope scope;
  return scope.Close(returnObj);
}

v8::Handle<v8::Value> TTSRequestFileEx(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);
  v8::String::Utf8Value arg4(args[4]);
  v8::String::Utf8Value arg5(args[5]);

  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  char* szSaveDir = const_cast<char*>(ToCString(arg4));
  char* szSaveFile = const_cast<char*>(ToCString(arg5));
  int nSpeakerID = args[6]->NumberValue();
  int nVoiceFormat = args[7]->NumberValue();
  int nTextFormat = args[8]->NumberValue();
  int nVolume = args[9]->NumberValue();
  int nSpeed = args[10]->NumberValue();
  int nPitch = args[11]->NumberValue();
  int nDictIndex = args[12]->NumberValue();

  int result = TTSRequestFileEx(szServer, nPort, pText, nTextLen, szSaveDir,
                                szSaveFile, nSpeakerID, nVoiceFormat,
                                nTextFormat, nVolume, nSpeed, nPitch,
                                nDictIndex);

  v8::HandleScope scope;
  return scope.Close(v8::Number::New(result));
}

v8::Handle<v8::Value> _TTSRequestBuffer(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);

  int sockfd = (args.Length() > 8 ? args[8]->NumberValue() : -1);
  char* szServer = const_cast<char*>(ToCString(arg0));;
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  int nVoiceLen = 0;
  int nSpeakerID = args[4]->NumberValue();
  int nVoiceFormat = args[5]->NumberValue();
  int bFirst = args[6]->NumberValue();
  int bAll = args[7]->NumberValue();
  int nReturn = TTS_RESULT_CONTINUE;

  char* result = _TTSRequestBuffer(&sockfd, szServer, nPort, pText, nTextLen,
                                   &nVoiceLen, nSpeakerID, nVoiceFormat, bFirst,
                                   bAll, &nReturn, NULL);

  bool success = ((nReturn == TTS_RESULT_CONTINUE || nReturn == TTS_RESULT_SUCCESS)
                && result != NULL && nVoiceLen > 0);

  v8::Local<v8::Object> resultBuffer;
  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), result, nVoiceLen);
    v8::Local<v8::Object> globalObj = v8::Context::GetCurrent()->Global();
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      globalObj->Get(v8::String::New("Buffer"))
    );
    v8::Handle<v8::Value> constructorArgs[3] = {
      slowBuffer->handle_,
      v8::Integer::New(nVoiceLen),
      v8::Integer::New(0)
    };
    resultBuffer = bufferConstructor->NewInstance(3, constructorArgs);
  }

  if (result) {
    delete result;
    result = NULL;
  }

  v8::Local<v8::Object> returnObj = v8::Object::New();
  if (success) {
    returnObj->Set(v8::String::NewSymbol("buffer"), resultBuffer);
  }
  if (nReturn == TTS_RESULT_CONTINUE) {
    returnObj->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(sockfd));
  }
  returnObj->Set(v8::String::NewSymbol("code"), v8::Number::New(nReturn));

  v8::HandleScope scope;
  return scope.Close(returnObj);
}

v8::Handle<v8::Value> _TTSRequestBufferEx(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);

  int sockfd = (args.Length() > 13 ? args[13]->NumberValue() : -1);
  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  int nVoiceLen = 0;
  int nSpeakerID = args[4]->NumberValue();
  int nVoiceFormat = args[5]->NumberValue();
  int nTextFormat = args[6]->NumberValue();
  int nVolume = args[7]->NumberValue();
  int nSpeed = args[8]->NumberValue();
  int nPitch = args[9]->NumberValue();
  int nDictIndex = args[10]->NumberValue();
  int bFirst = args[11]->NumberValue();
  int bAll = args[12]->NumberValue();
  int nReturn = TTS_RESULT_CONTINUE;

  char* result = _TTSRequestBufferEx(&sockfd, szServer, nPort, pText, nTextLen,
                                   &nVoiceLen, nSpeakerID, nVoiceFormat,
                                   nTextFormat, nVolume, nSpeed, nPitch,
                                   nDictIndex, bFirst, bAll, &nReturn, NULL);

  bool success = ((nReturn == TTS_RESULT_CONTINUE || nReturn == TTS_RESULT_SUCCESS)
                && result != NULL && nVoiceLen > 0);

  v8::Local<v8::Object> resultBuffer;
  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), result, nVoiceLen);
    v8::Local<v8::Object> globalObj = v8::Context::GetCurrent()->Global();
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      globalObj->Get(v8::String::New("Buffer"))
    );
    v8::Handle<v8::Value> constructorArgs[3] = {
      slowBuffer->handle_,
      v8::Integer::New(nVoiceLen),
      v8::Integer::New(0)
    };
    resultBuffer = bufferConstructor->NewInstance(3, constructorArgs);
  }

  if (result) {
    delete result;
    result = NULL;
  }

  v8::Local<v8::Object> returnObj = v8::Object::New();
  if (success) {
    returnObj->Set(v8::String::NewSymbol("buffer"), resultBuffer);
  }
  if (nReturn == TTS_RESULT_CONTINUE) {
    returnObj->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(sockfd));
  }
  returnObj->Set(v8::String::NewSymbol("code"), v8::Number::New(nReturn));

  v8::HandleScope scope;
  return scope.Close(returnObj);
}

v8::Handle<v8::Value> _TTSRequestBufferSSMLEx(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);
  v8::String::Utf8Value arg2(args[2]);

  int sockfd = (args.Length() > 11 ? args[11]->NumberValue() : -1);
  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();
  char* pText = const_cast<char*>(ToCString(arg2));
  int nTextLen = args[3]->NumberValue();
  int nVoiceLen = 0;
  int nSpeakerID = args[4]->NumberValue();
  int nVoiceFormat = args[5]->NumberValue();
  int nVolume = args[6]->NumberValue();
  int nSpeed = args[7]->NumberValue();
  int nPitch = args[8]->NumberValue();
  int nDictIndex = args[9]->NumberValue();
  int nMarkSize = 0;
  TTSMARK* pTTSMark = NULL;
  int bFirst = args[10]->NumberValue();
  int nReturn = TTS_RESULT_CONTINUE;

  char* result = _TTSRequestBufferSSMLEx(&sockfd, szServer, nPort, pText,
                                         nTextLen, &nVoiceLen, nSpeakerID,
                                         nVoiceFormat, nVolume, nSpeed, nPitch,
                                         nDictIndex, &nMarkSize, &pTTSMark,
                                         bFirst, &nReturn, NULL);

  bool success = ((nReturn == TTS_RESULT_CONTINUE || nReturn == TTS_RESULT_SUCCESS)
                && result != NULL && nVoiceLen > 0);

  v8::Local<v8::Object> resultBuffer;
  if (success) {
    node::Buffer* slowBuffer = node::Buffer::New(nVoiceLen);
    memcpy(node::Buffer::Data(slowBuffer), result, nVoiceLen);
    v8::Local<v8::Object> globalObj = v8::Context::GetCurrent()->Global();
    v8::Local<v8::Function> bufferConstructor = v8::Local<v8::Function>::Cast(
      globalObj->Get(v8::String::New("Buffer"))
    );
    v8::Handle<v8::Value> constructorArgs[3] = {
      slowBuffer->handle_,
      v8::Integer::New(nVoiceLen),
      v8::Integer::New(0)
    };
    resultBuffer = bufferConstructor->NewInstance(3, constructorArgs);
  }

  if (result) {
    delete result;
    result = NULL;
  }

  v8::Local<v8::Array> marksArray = v8::Array::New();
  for (int i = 0; i < nMarkSize; ++i) {
    v8::Local<v8::Object> markObj = v8::Object::New();
    markObj->Set(v8::String::NewSymbol("name"), v8::String::New(pTTSMark[i].sMarkName));
    markObj->Set(v8::String::NewSymbol("streamOffset"), v8::Number::New(pTTSMark[i].nOffsetInStream));
    markObj->Set(v8::String::NewSymbol("bufferOffset"), v8::Number::New(pTTSMark[i].nOffsetInBuffer));
    // markObj->Set(v8::String::NewSymbol("textPos"), v8::Number::New(pTTSMark[i].nPosInText));
    marksArray->Set(v8::Number::New(i), markObj);
  }

  v8::Local<v8::Object> returnObj = v8::Object::New();
  if (success) {
    returnObj->Set(v8::String::NewSymbol("buffer"), resultBuffer);
  }
  if (nReturn == TTS_RESULT_CONTINUE) {
    returnObj->Set(v8::String::NewSymbol("sockfd"), v8::Number::New(sockfd));
  }
  returnObj->Set(v8::String::NewSymbol("marks"), marksArray);
  returnObj->Set(v8::String::NewSymbol("code"), v8::Number::New(nReturn));

  v8::HandleScope scope;
  return scope.Close(returnObj);
}

v8::Handle<v8::Value> TTSRequestStatus(const v8::Arguments& args) {
  v8::String::Utf8Value arg0(args[0]);

  char* szServer = const_cast<char*>(ToCString(arg0));
  int nPort = args[1]->NumberValue();

  int result = TTSRequestStatus(szServer, nPort);

  v8::HandleScope scope;
  return scope.Close(v8::Number::New(result));
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

  target->Set(v8::String::NewSymbol("_TTSRequestBuffer"),
              v8::FunctionTemplate::New(_TTSRequestBuffer)->GetFunction());

  target->Set(v8::String::NewSymbol("_TTSRequestBufferEx"),
              v8::FunctionTemplate::New(_TTSRequestBufferEx)->GetFunction());

  target->Set(v8::String::NewSymbol("_TTSRequestBufferSSMLEx"),
              v8::FunctionTemplate::New(_TTSRequestBufferSSMLEx)->GetFunction());

  target->Set(v8::String::NewSymbol("TTSRequestStatus"),
              v8::FunctionTemplate::New(TTSRequestStatus)->GetFunction());
}

NODE_MODULE(neospeech, Initialize)
