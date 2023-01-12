const vertex = `#version 300 es

layout (location = 0) in vec3 aPosition;
layout (location = 3) in vec2 aTexCoord;
layout (location = 1) in vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

out vec3 vPosition;
out vec3 vNormal;
out vec2 vTexCoord;

void main() {
    vPosition = (uModelMatrix * vec4(aPosition, 1)).xyz;
    vNormal = mat3(uModelMatrix) * aNormal;
    vTexCoord = aTexCoord;

    gl_Position = uProjectionMatrix * (uViewMatrix * vec4(vPosition, 1));
}
`;

const fragment = `#version 300 es
precision mediump float;

uniform mediump sampler2D uTexture;

uniform vec3 uCameraPosition;

struct Light {
    vec3 position;
    vec3 attenuation;
    vec3 color;
};

struct Material {
    float diffuse;
    float specular;
    float shininess;
};

uniform Light uLight;
uniform Material uMaterial;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;

// uniform sampler2D uBaseColorTexture;
// uniform vec4 uBaseColorFactor;

// in vec2 vTexCoord;
// in vec3 vLight;

out vec4 oColor;

void main() {

    vec3 surfacePosition = vPosition;
    float d = distance(surfacePosition, uLight.position);
    float attenuation = 1.0 / dot(uLight.attenuation, vec3(1, d, d * d));

    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLight.position - surfacePosition);
    vec3 V = normalize(uCameraPosition - surfacePosition);
    vec3 R = normalize(reflect(-L, N));

    float lambert = max(0.0, dot(L, N)) * uMaterial.diffuse;
    float phong = pow(max(0.0, dot(V, R)), uMaterial.shininess) * uMaterial.specular;

    vec3 diffuseLight = lambert * attenuation * uLight.color;
    vec3 specularLight = phong * attenuation * uLight.color;

    const float gamma = 2.2;
    vec3 albedo = pow(texture(uTexture, vTexCoord).rgb, vec3(gamma));
    vec3 finalColor = albedo * diffuseLight + specularLight;
    oColor = pow(vec4(finalColor, 1), vec4(1.0 / gamma));

    // vec4 baseColor = texture(uBaseColorTexture, vTexCoord) * vec4(vLight, 1.0);
    // oColor = uBaseColorFactor * baseColor;
}
`;

export const shaders = {
    simple: { vertex, fragment }
};
