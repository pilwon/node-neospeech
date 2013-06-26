/*
 * binding/neospeech.h
 */

#ifndef NEOSPEECH_NEOSPEECH_H_
#define NEOSPEECH_NEOSPEECH_H_

#include <string>

#include <node.h>
#include <v8.h>

#include "libttsapi/libttsapi.h"

struct TTSRequestFile_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  std::string szSaveDir;
  std::string szSaveFile;
  int nSpeakerID;
  int nVoiceFormat;

  // Output
  int result;
};

struct TTSRequestFileSSML_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  std::string szSaveDir;
  std::string szSaveFile;
  int nSpeakerID;
  int nVoiceFormat;

  // Output
  int result;
  int nMarkSize;
  TTSMARK* pTTSMark;
  int nVoiceLen;
};

struct TTSRequestFileEx_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  std::string szSaveDir;
  std::string szSaveFile;
  int nSpeakerID;
  int nVoiceFormat;
  int nTextFormat;
  int nVolume;
  int nSpeed;
  int nPitch;
  int nDictIndex;

  // Output
  int result;
};

struct TTSRequestBuffer_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  int nSpeakerID;
  int nVoiceFormat;
  int bFirst;
  int bAll;

  // Output
  char* result;
  int sockfd;
  int nVoiceLen;
  int nReturn;
};

struct TTSRequestBufferEx_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  int nSpeakerID;
  int nVoiceFormat;
  int nTextFormat;
  int nVolume;
  int nSpeed;
  int nPitch;
  int nDictIndex;
  int bFirst;
  int bAll;

  // Output
  char* result;
  int sockfd;
  int nVoiceLen;
  int nReturn;
};

struct TTSRequestBufferSSMLEx_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;
  std::string pText;
  int nTextLen;
  int nSpeakerID;
  int nVoiceFormat;
  int nVolume;
  int nSpeed;
  int nPitch;
  int nDictIndex;
  int bFirst;

  // Output
  char* result;
  int sockfd;
  int nVoiceLen;
  int nMarkSize;
  TTSMARK* pTTSMark;
  int nReturn;
};

struct TTSRequestStatus_Baton {
  // Callback
  v8::Persistent<v8::Function> callback;

  // Input
  std::string szServer;
  int nPort;

  // Output
  int result;
};

v8::Handle<v8::Value> TTSRequestFile(const v8::Arguments& args);
void TTSRequestFile_Work(uv_work_t* req);
void TTSRequestFile_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestFileSSML(const v8::Arguments& args);
void TTSRequestFileSSML_Work(uv_work_t* req);
void TTSRequestFileSSML_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestFileEx(const v8::Arguments& args);
void TTSRequestFileEx_Work(uv_work_t* req);
void TTSRequestFileEx_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestBuffer(const v8::Arguments& args);
void TTSRequestBuffer_Work(uv_work_t* req);
void TTSRequestBuffer_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestBufferEx(const v8::Arguments& args);
void TTSRequestBufferEx_Work(uv_work_t* req);
void TTSRequestBufferEx_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestBufferSSMLEx(const v8::Arguments& args);
void TTSRequestBufferSSMLEx_Work(uv_work_t* req);
void TTSRequestBufferSSMLEx_After(uv_work_t* req);

v8::Handle<v8::Value> TTSRequestStatus(const v8::Arguments& args);
void TTSRequestStatus_Work(uv_work_t* req);
void TTSRequestStatus_After(uv_work_t* req);

#endif  // NEOSPEECH_NEOSPEECH_H_
